<?php

namespace App\Http\Controllers\Api;

use App\Models\Person;
use Illuminate\Http\Request;

class PersonController
{
    public function index(Request $request)
    {
        return response()->json($request->user()->people);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $person = $request->user()->people()->create($validated);
        return response()->json($person, 201);
    }

    public function show(Request $request, string $id)
    {
        $person = $request->user()->people()->findOrFail($id);
        return response()->json($person);
    }

    public function update(Request $request, string $id)
    {
        $person = $request->user()->people()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
        ]);

        $person->update($validated);
        return response()->json($person);
    }

    public function destroy(Request $request, string $id)
    {
        $person = $request->user()->people()->findOrFail($id);
        $person->delete();
        return response()->json(null, 204);
    }
}
