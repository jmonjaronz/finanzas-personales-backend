import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, ArrowRight, Loader2, Clock, Wallet } from 'lucide-react';
import { useState } from 'react';
import { PremiumCard } from '../components/PremiumCard';
import { PremiumButton } from '../components/PremiumButton';
import { dataService } from '../services/dataService';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transfer, Account } from '../types';

export const TransfersPage = () => {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        from_account_id: '',
        to_account_id: '',
    });

    const { data: transfers, isLoading } = useQuery({
        queryKey: ['transfers'],
        queryFn: dataService.getTransfers,
    });

    const { data: accounts } = useQuery({ queryKey: ['accounts'], queryFn: dataService.getAccounts });

    const createMutation = useMutation({
        mutationFn: dataService.createTransfer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transfers'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            setIsAdding(false);
            setFormData({
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                from_account_id: '',
                to_account_id: '',
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount || !formData.from_account_id || !formData.to_account_id) return;
        if (formData.from_account_id === formData.to_account_id) {
            alert('La cuenta de origen y destino no pueden ser la misma');
            return;
        }

        createMutation.mutate({
            description: formData.description,
            amount: Number(formData.amount),
            date: formData.date,
            from_account_id: Number(formData.from_account_id),
            to_account_id: Number(formData.to_account_id),
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-bold premium-gradient-text tracking-tight mb-2">Transferencias</h1>
                    <p className="text-muted-foreground">Mueve dinero entre tus propias cuentas sin afectar ingresos ni gastos.</p>
                </div>
                <PremiumButton onClick={() => setIsAdding(true)} variant="glass" className="h-12 border-indigo-500/20">
                    <RefreshCw size={20} /> Nueva Transferencia
                </PremiumButton>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-8"
                    >
                        <PremiumCard className="max-w-4xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Wallet size={14} /> Cuenta Origen
                                        </label>
                                        <select
                                            required
                                            value={formData.from_account_id}
                                            onChange={(e) => setFormData({ ...formData, from_account_id: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        >
                                            <option value="">Desde...</option>
                                            {accounts?.map((acc: Account) => <option key={acc.id} value={acc.id}>{acc.name} (${acc.current_balance})</option>)}
                                        </select>
                                    </div>

                                    <div className="flex justify-center pt-6">
                                        <div className="p-3 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400">
                                            <ArrowRight size={24} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Wallet size={14} /> Cuenta Destino
                                        </label>
                                        <select
                                            required
                                            value={formData.to_account_id}
                                            onChange={(e) => setFormData({ ...formData, to_account_id: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        >
                                            <option value="">Hacia...</option>
                                            {accounts?.map((acc: Account) => <option key={acc.id} value={acc.id}>{acc.name} (${acc.current_balance})</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground">Monto</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground">Fecha</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground">Descripción (Opcional)</label>
                                        <input
                                            type="text"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            placeholder="Motivo del movimiento..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-white/5">
                                    <PremiumButton type="submit" disabled={createMutation.isPending} className="flex-1">
                                        {createMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : 'Ejecutar Transferencia'}
                                    </PremiumButton>
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="px-8 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/5 font-semibold"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </PremiumCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <Clock size={20} className="text-indigo-400" />
                    <h2 className="text-xl font-bold text-white">Historial de Transferencias</h2>
                </div>

                <div className="space-y-3">
                    {transfers?.map((tr: Transfer, idx: number) => (
                        <PremiumCard key={tr.id} delay={idx * 0.05} className="!p-4 bg-indigo-500/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Origen</p>
                                            <p className="font-semibold text-white">{tr.from_account?.name}</p>
                                        </div>
                                        <div className="p-2 bg-indigo-500/10 rounded-full text-indigo-400">
                                            <ArrowRight size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Destino</p>
                                            <p className="font-semibold text-white">{tr.to_account?.name}</p>
                                        </div>
                                    </div>
                                    <div className="h-8 w-px bg-white/10 mx-2" />
                                    <div>
                                        <p className="font-medium text-white/80">{tr.description || 'Sin descripción'}</p>
                                        <p className="text-xs text-muted-foreground">{tr.date}</p>
                                    </div>
                                </div>
                                <p className="text-xl font-black text-white">
                                    ${Number(tr.amount).toLocaleString()}
                                </p>
                            </div>
                        </PremiumCard>
                    ))}

                    {transfers?.length === 0 && (
                        <div className="text-center py-20 glass-card rounded-2xl border-dashed border-white/10">
                            <RefreshCw size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                            <p className="text-muted-foreground text-lg">No has realizado transferencias aún.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
