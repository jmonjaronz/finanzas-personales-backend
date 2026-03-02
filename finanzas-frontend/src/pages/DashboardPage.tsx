import { useQuery } from '@tanstack/react-query';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCw,
    Loader2
} from 'lucide-react';
import { PremiumCard } from '../components/PremiumCard';
import { dataService } from '../services/dataService';

export const DashboardPage = () => {
    const { data: summary, isLoading } = useQuery({
        queryKey: ['dashboard-summary'],
        queryFn: async () => {
            const res = await dataService.getDashboardSummary();
            return res;
        }
    });

    const { data: transactions } = useQuery({
        queryKey: ['recent-transactions'],
        queryFn: dataService.getTransactions,
    });

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
            </div>
        );
    }

    const cards = [
        {
            title: 'Saldo Total',
            amount: summary?.total_balance || 0,
            icon: Wallet,
            color: 'indigo',
            trend: '+2.5%',
        },
        {
            title: 'Ingresos (Mes)',
            amount: summary?.monthly_income || 0,
            icon: TrendingUp,
            color: 'emerald',
            trend: '+12%',
        },
        {
            title: 'Gastos (Mes)',
            amount: summary?.monthly_expense || 0,
            icon: TrendingDown,
            color: 'rose',
            trend: '-4%',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold premium-gradient-text tracking-tight mb-2">Hola, Bienvenido</h1>
                <p className="text-muted-foreground">Aquí tienes un resumen de tus finanzas personales hoy.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <PremiumCard key={card.title} delay={idx * 0.1} className="relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity -rotate-12 group-hover:rotate-0 duration-500`}>
                            <card.icon size={80} />
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-2xl bg-${card.color}-500/10 text-${card.color}-400 border border-${card.color}-500/20`}>
                                <card.icon size={24} />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
                        </div>

                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-black text-white">
                                ${card.amount.toLocaleString()}
                            </h3>
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${card.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {card.trend}
                            </span>
                        </div>
                    </PremiumCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Transactions */}
                <PremiumCard className="overflow-hidden !p-0" delay={0.4}>
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Actividad Reciente</h3>
                        <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Ver Todo</button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {transactions?.slice(0, 5).map((tx) => (
                            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                        {tx.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white text-sm">{tx.description}</p>
                                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                                    </div>
                                </div>
                                <span className={`font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </PremiumCard>

                {/* Quick Info/Tips */}
                <PremiumCard className="flex flex-col justify-center items-center text-center p-12 border-dashed border-white/10" delay={0.5}>
                    <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400 mb-6">
                        <RefreshCw size={32} className="opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Consejo del día</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                        Mantén tus categorías organizadas para obtener un análisis más preciso de tus gastos mensuales.
                    </p>
                    <button className="mt-8 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all border border-white/10">
                        Configurar Metas
                    </button>
                </PremiumCard>
            </div>
        </div>
    );
};
