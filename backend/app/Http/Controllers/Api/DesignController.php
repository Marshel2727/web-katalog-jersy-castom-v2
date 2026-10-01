<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CatalogIndexRequest;
use App\Http\Requests\Design\StoreDesignRequest;
use App\Http\Requests\Design\UpdateDesignRequest;
use App\Http\Resources\DesignResource;
use App\Models\Design;
use App\Services\DesignService;
use Illuminate\Http\Request;

class DesignController extends Controller
{
    public function __construct(private DesignService $service) {}

    public function index(CatalogIndexRequest $request)
    {
        $query = Design::query()->with(['category', 'images']);
        if (! $request->routeIs('admin.*')) {
            $query->published();
        }

        if ($category = $request->validated('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }
        if ($request->validated('collection') === 'popular') {
            $query->where('is_popular', true);
        }
        if ($request->validated('collection') === 'previous') {
            $query->where('is_previous_order', true);
        }

        if ($term = $request->validated('q')) {
            $query->where(function ($search) use ($term) {
                $search->where('name', 'like', '%'.$term.'%');
                $search->orWhere('code', 'like', '%'.$term.'%');
            });
        }

        return DesignResource::collection($query->orderBy('sort_order')->orderBy('id')->paginate($request->integer('per_page', 24))->withQueryString());
    }

    public function show(Request $request, Design $design)
    {
        $model = $design;
        $model->load(['category', 'images']);
        if (! $request->routeIs('admin.*')) {
            abort_unless($model->is_active && $model->category->is_active, 404);
        }

        return new DesignResource($model);
    }

    public function store(StoreDesignRequest $request)
    {
        return (new DesignResource($this->service->create($request->validated())))->response()->setStatusCode(201);
    }

    public function update(UpdateDesignRequest $request, Design $design)
    {
        return new DesignResource($this->service->update($design, $request->validated()));
    }

    public function destroy(Design $design)
    {
        $this->service->delete($design);

        return response()->noContent();
    }
}
