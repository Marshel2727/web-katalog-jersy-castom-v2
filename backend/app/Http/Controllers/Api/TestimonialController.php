<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CatalogIndexRequest;
use App\Http\Requests\Testimonial\StoreTestimonialRequest;
use App\Http\Requests\Testimonial\UpdateTestimonialRequest;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use App\Services\TestimonialService;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function __construct(private TestimonialService $service) {}

    public function index(CatalogIndexRequest $request)
    {
        $query = Testimonial::query();
        if (! $request->routeIs('admin.*')) {
            $query->where('is_active', true);
        }

        if ($term = $request->validated('q')) {
            $query->where(function ($search) use ($term) {
                $search->where('name', 'like', '%'.$term.'%');
                $search->orWhere('team', 'like', '%'.$term.'%');
            });
        }

        return TestimonialResource::collection($query->orderBy('sort_order')->orderBy('id')->paginate($request->integer('per_page', 24))->withQueryString());
    }

    public function show(Request $request, Testimonial $testimonial)
    {
        $model = $testimonial;

        if (! $request->routeIs('admin.*')) {
            abort_unless($model->is_active, 404);
        }

        return new TestimonialResource($model);
    }

    public function store(StoreTestimonialRequest $request)
    {
        return (new TestimonialResource($this->service->create($request->validated())))->response()->setStatusCode(201);
    }

    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial)
    {
        return new TestimonialResource($this->service->update($testimonial, $request->validated()));
    }

    public function destroy(Testimonial $testimonial)
    {
        $this->service->delete($testimonial);

        return response()->noContent();
    }
}
