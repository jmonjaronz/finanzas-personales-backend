<?php

namespace App\Http\Controllers\Api;

use App\Models\Account;
use App\Http\Requests\StoreAccountRequest;
use Illuminate\Http\Request;

class AccountController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return response()->json($request->user()->accounts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAccountRequest $request)
    {
        $account = $request->user()->accounts()->create($request->validated());
        return response()->json($account, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $account = $request->user()->accounts()->findOrFail($id);
        return response()->json($account);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $account = $request->user()->accounts()->findOrFail($id);
        // Basic validation for testing
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|max:50',
            'initial_balance' => 'sometimes|numeric',
            'allows_negative' => 'sometimes|boolean',
        ]);

        $account->update($validated);
        return response()->json($account);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $account = $request->user()->accounts()->findOrFail($id);
        $account->delete();
        return response()->json(null, 204);
    }
}
