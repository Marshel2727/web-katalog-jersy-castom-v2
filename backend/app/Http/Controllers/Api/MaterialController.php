<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CatalogIndexRequest;
use App\Http\Requests\Material\StoreMaterialRequest;
use App\Http\Requests\Material\UpdateMaterialRequest;
use App\Http\Resources\MaterialResource;
use App\Models\Material;
use App\Services\MaterialService;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    public function __construct(private MaterialService $service) {}

    public function index(CatalogIndexRequest $request)
    {
        $query = Material::query();
        if (! $request->routeIs('admin.*')) {
            $query->where('is_active', true);
        }

        if ($term = $request->validated('q')) {
            $query->where(function ($search) use ($term) {
                $search->where('name', 'like', '%'.$term.'%');
            });
        }

        return MaterialResource::collection($query->orderBy('sort_order')->orderBy('id')->paginate($request->integer('per_page', 24))->withQueryString());
    }

    public function show(Request $request, Material $material)
    {
        $model = $material;

        if (! $request->routeIs('admin.*')) {
            abort_unless($model->is_active, 404);
        }

        return new MaterialResource($model);
    }

    public function store(StoreMaterialRequest $request)
    {
        return (new MaterialResource($this->service->create($request->validated())))->response()->setStatusCode(201);
    }

    public function update(UpdateMaterialRequest $request, Material $material)
    {
        return new MaterialResource($this->service->update($material, $request->validated()));
    }

    public function destroy(Material $material)
    {
        $this->service->delete($material);

        return response()->noContent();
    }
}
