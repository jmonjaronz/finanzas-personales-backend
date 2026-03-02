<?php

namespace App\Http\Controllers\Api;

use App\Models\Transfer;
use Illuminate\Http\Request;

class TransferController
{
    public function index(Request $request)
    {
        $transfers = $request->user()->transfers()->with(['sourceAccount', 'destinationAccount'])->get();
        return response()->json($transfers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'source_account_id' => 'required|exists:accounts,id',
            'destination_account_id' => 'required|exists:accounts,id|different:source_account_id',
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'description' => 'nullable|string'
        ]);

        $request->user()->accounts()->findOrFail($validated['source_account_id']);
        $request->user()->accounts()->findOrFail($validated['destination_account_id']);

        $transfer = $request->user()->transfers()->create($validated);

        return response()->json($transfer, 201);
    }

    public function show(Request $request, string $id)
    {
        $transfer = $request->user()->transfers()->with(['sourceAccount', 'destinationAccount'])->findOrFail($id);
        return response()->json($transfer);
    }

    public function update(Request $request, string $id)
    {
        $transfer = $request->user()->transfers()->findOrFail($id);

        $validated = $request->validate([
            'source_account_id' => 'sometimes|exists:accounts,id',
            'destination_account_id' => 'sometimes|exists:accounts,id|different:source_account_id',
            'amount' => 'sometimes|numeric|min:0.01',
            'date' => 'sometimes|date',
            'description' => 'nullable|string'
        ]);

        if (isset($validated['source_account_id'])) {
            $request->user()->accounts()->findOrFail($validated['source_account_id']);
        }
        if (isset($validated['destination_account_id'])) {
            $request->user()->accounts()->findOrFail($validated['destination_account_id']);
        }

        $transfer->update($validated);
        return response()->json($transfer);
    }

    public function destroy(Request $request, string $id)
    {
        $transfer = $request->user()->transfers()->findOrFail($id);
        $transfer->delete();
        return response()->json(null, 204);
    }
}
