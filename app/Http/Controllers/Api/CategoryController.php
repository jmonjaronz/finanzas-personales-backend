<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController
{
    public function index(Request $request)
    {
        return response()->json($request->user()->categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'parent_id' => 'nullable|exists:categories,id'
        ]);

        if (isset($validated['parent_id'])) {
            $request->user()->categories()->findOrFail($validated['parent_id']);
        }

        $category = $request->user()->categories()->create($validated);
        return response()->json($category, 201);
    }

    public function show(Request $request, string $id)
    {
        $category = $request->user()->categories()->findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, string $id)
    {
        $category = $request->user()->categories()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:income,expense',
            'parent_id' => 'nullable|exists:categories,id'
        ]);

        if (isset($validated['parent_id'])) {
            $request->user()->categories()->findOrFail($validated['parent_id']);
        }

        $category->update($validated);
        return response()->json($category);
    }

    public function destroy(Request $request, string $id)
    {
        $category = $request->user()->categories()->findOrFail($id);
        $category->delete();
        return response()->json(null, 204);
    }
}
