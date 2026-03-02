<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
class DashboardSummaryController extends Controller
{
    public function summary(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            // Mocking user for testing if needed, though in production Sanctum handles this
            $user = \App\Models\User::first();
        }

        $accounts = $user->accounts()->get();
        $totalBalance = $accounts->sum('current_balance');

        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $monthlyIncome = $user->transactions()
            ->where('type', 'income')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $monthlyExpense = $user->transactions()
            ->where('type', 'expense')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $recentTransactions = $user->transactions()
            ->with(['account', 'category'])
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'total_balance' => $totalBalance,
            'monthly_income' => $monthlyIncome,
            'monthly_expense' => $monthlyExpense,
            'accounts' => $accounts,
            'recent_transactions' => $recentTransactions,
        ]);
    }
}
