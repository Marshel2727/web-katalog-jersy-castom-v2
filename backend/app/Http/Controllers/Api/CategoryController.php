<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CatalogIndexRequest;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(private CategoryService $service) {}

    public function index(CatalogIndexRequest $request)
    {
        $query = Category::query();
        if (! $request->routeIs('admin.*')) {
            $query->where('is_active', true);
        }

        if ($term = $request->validated('q')) {
            $query->where(function ($search) use ($term) {
                $search->where('name', 'like', '%'.$term.'%');
            });
        }

        return CategoryResource::collection($query->orderBy('sort_order')->orderBy('id')->paginate($request->integer('per_page', 24))->withQueryString());
    }

    public function show(Request $request, Category $category)
    {
        $model = $category;

        if (! $request->routeIs('admin.*')) {
            abort_unless($model->is_active, 404);
        }

        return new CategoryResource($model);
    }

    public function store(StoreCategoryRequest $request)
    {
        return (new CategoryResource($this->service->create($request->validated())))->response()->setStatusCode(201);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        return new CategoryResource($this->service->update($category, $request->validated()));
    }

    public function destroy(Category $category)
    {
        $this->service->delete($category);

        return response()->noContent();
    }
}
