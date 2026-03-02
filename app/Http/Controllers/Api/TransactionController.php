<?php

namespace App\Http\Controllers\Api;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController
{
    public function index(Request $request)
    {
        $transactions = $request->user()->transactions()->with(['account', 'category', 'person', 'transactionChannel'])->get();
        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'category_id' => 'required|exists:categories,id',
            'transaction_channel_id' => 'nullable|exists:transaction_channels,id',
            'person_id' => 'nullable|exists:people,id',
            'amount' => 'required|numeric|min:0.01',
            'type' => 'required|in:income,expense',
            'date' => 'required|date',
            'description' => 'nullable|string'
        ]);

        $request->user()->accounts()->findOrFail($validated['account_id']);
        $request->user()->categories()->findOrFail($validated['category_id']);

        if (!empty($validated['transaction_channel_id'])) {
            $request->user()->transactionChannels()->findOrFail($validated['transaction_channel_id']);
        }
        if (!empty($validated['person_id'])) {
            $request->user()->people()->findOrFail($validated['person_id']);
        }

        $transaction = $request->user()->transactions()->create($validated);

        return response()->json($transaction, 201);
    }

    public function show(Request $request, string $id)
    {
        $transaction = $request->user()->transactions()->with(['account', 'category', 'person', 'transactionChannel'])->findOrFail($id);
        return response()->json($transaction);
    }

    public function update(Request $request, string $id)
    {
        $transaction = $request->user()->transactions()->findOrFail($id);

        $validated = $request->validate([
            'account_id' => 'sometimes|exists:accounts,id',
            'category_id' => 'sometimes|exists:categories,id',
            'transaction_channel_id' => 'nullable|exists:transaction_channels,id',
            'person_id' => 'nullable|exists:people,id',
            'amount' => 'sometimes|numeric|min:0.01',
            'type' => 'sometimes|in:income,expense',
            'date' => 'sometimes|date',
            'description' => 'nullable|string'
        ]);

        if (isset($validated['account_id'])) {
            $request->user()->accounts()->findOrFail($validated['account_id']);
        }
        if (isset($validated['category_id'])) {
            $request->user()->categories()->findOrFail($validated['category_id']);
        }
        if (isset($validated['transaction_channel_id'])) {
            $request->user()->transactionChannels()->findOrFail($validated['transaction_channel_id']);
        }
        if (isset($validated['person_id'])) {
            $request->user()->people()->findOrFail($validated['person_id']);
        }

        $transaction->update($validated);
        return response()->json($transaction);
    }

    public function destroy(Request $request, string $id)
    {
        $transaction = $request->user()->transactions()->findOrFail($id);
        $transaction->delete();
        return response()->json(null, 204);
    }
}
