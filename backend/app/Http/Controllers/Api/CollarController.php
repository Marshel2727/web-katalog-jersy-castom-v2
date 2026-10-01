<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CatalogIndexRequest;
use App\Http\Requests\Collar\StoreCollarRequest;
use App\Http\Requests\Collar\UpdateCollarRequest;
use App\Http\Resources\CollarResource;
use App\Models\Collar;
use App\Services\CollarService;
use Illuminate\Http\Request;

class CollarController extends Controller
{
    public function __construct(private CollarService $service) {}

    public function index(CatalogIndexRequest $request)
    {
        $query = Collar::query();
        if (! $request->routeIs('admin.*')) {
            $query->where('is_active', true);
        }

        if ($term = $request->validated('q')) {
            $query->where(function ($search) use ($term) {
                $search->where('name', 'like', '%'.$term.'%');
            });
        }

        return CollarResource::collection($query->orderBy('sort_order')->orderBy('id')->paginate($request->integer('per_page', 24))->withQueryString());
    }

    public function show(Request $request, Collar $collar)
    {
        $model = $collar;

        if (! $request->routeIs('admin.*')) {
            abort_unless($model->is_active, 404);
        }

        return new CollarResource($model);
    }

    public function store(StoreCollarRequest $request)
    {
        return (new CollarResource($this->service->create($request->validated())))->response()->setStatusCode(201);
    }

    public function update(UpdateCollarRequest $request, Collar $collar)
    {
        return new CollarResource($this->service->update($collar, $request->validated()));
    }

    public function destroy(Collar $collar)
    {
        $this->service->delete($collar);

        return response()->noContent();
    }
}
