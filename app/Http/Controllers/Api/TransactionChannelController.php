<?php

namespace App\Http\Controllers\Api;

use App\Models\TransactionChannel;
use Illuminate\Http\Request;

class TransactionChannelController
{
    public function index(Request $request)
    {
        return response()->json($request->user()->transactionChannels);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'account_id' => 'required|exists:accounts,id'
        ]);

        // Ensure account belongs to user
        $request->user()->accounts()->findOrFail($validated['account_id']);

        $channel = $request->user()->transactionChannels()->create($validated);
        return response()->json($channel, 201);
    }

    public function show(Request $request, string $id)
    {
        $channel = $request->user()->transactionChannels()->findOrFail($id);
        return response()->json($channel);
    }

    public function update(Request $request, string $id)
    {
        $channel = $request->user()->transactionChannels()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'account_id' => 'sometimes|exists:accounts,id'
        ]);

        if (isset($validated['account_id'])) {
            $request->user()->accounts()->findOrFail($validated['account_id']);
        }

        $channel->update($validated);
        return response()->json($channel);
    }

    public function destroy(Request $request, string $id)
    {
        $channel = $request->user()->transactionChannels()->findOrFail($id);
        $channel->delete();
        return response()->json(null, 204);
    }
}
