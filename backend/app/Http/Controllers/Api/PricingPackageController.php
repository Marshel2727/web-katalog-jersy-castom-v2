<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CatalogIndexRequest;
use App\Http\Requests\PricingPackage\StorePricingPackageRequest;
use App\Http\Requests\PricingPackage\UpdatePricingPackageRequest;
use App\Http\Resources\PricingPackageResource;
use App\Models\PricingPackage;
use App\Services\PricingPackageService;
use Illuminate\Http\Request;

class PricingPackageController extends Controller
{
    public function __construct(private PricingPackageService $service) {}

    public function index(CatalogIndexRequest $request)
    {
        $query = PricingPackage::query()->with('options');
        if (! $request->routeIs('admin.*')) {
            $query->where('is_active', true);
        }
        if ($group = $request->validated('group')) {
            $query->where('group', $group);
        }
        if ($term = $request->validated('q')) {
            $query->where(function ($search) use ($term) {
                $search->where('name', 'like', '%'.$term.'%');
            });
        }

        return PricingPackageResource::collection($query->orderBy('sort_order')->orderBy('id')->paginate($request->integer('per_page', 24))->withQueryString());
    }

    public function show(Request $request, PricingPackage $pricingPackage)
    {
        $model = $pricingPackage;
        $model->load('options');
        if (! $request->routeIs('admin.*')) {
            abort_unless($model->is_active, 404);
        }

        return new PricingPackageResource($model);
    }

    public function store(StorePricingPackageRequest $request)
    {
        return (new PricingPackageResource($this->service->create($request->validated())))->response()->setStatusCode(201);
    }

    public function update(UpdatePricingPackageRequest $request, PricingPackage $pricingPackage)
    {
        return new PricingPackageResource($this->service->update($pricingPackage, $request->validated()));
    }

    public function destroy(PricingPackage $pricingPackage)
    {
        $this->service->delete($pricingPackage);

        return response()->noContent();
    }
}
