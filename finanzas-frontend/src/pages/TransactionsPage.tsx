import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, TrendingUp, TrendingDown, Clock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { PremiumCard } from '../components/PremiumCard';
import { PremiumButton } from '../components/PremiumButton';
import { dataService } from '../services/dataService';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transaction, Account, Category, Person } from '../types';

export const TransactionsPage = () => {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'expense' as 'income' | 'expense',
        date: new Date().toISOString().split('T')[0],
        account_id: '',
        category_id: '',
        person_id: '',
        channel_id: '',
    });

    const { data: transactions, isLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: dataService.getTransactions,
    });

    const { data: accounts } = useQuery({ queryKey: ['accounts'], queryFn: dataService.getAccounts });
    const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: dataService.getCategories });
    const { data: people } = useQuery({ queryKey: ['people'], queryFn: dataService.getPeople });

    const createMutation = useMutation({
        mutationFn: dataService.createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            setIsAdding(false);
            setFormData({
                description: '',
                amount: '',
                type: 'expense',
                date: new Date().toISOString().split('T')[0],
                account_id: '',
                category_id: '',
                person_id: '',
                channel_id: '',
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount || !formData.account_id || !formData.category_id) return;

        createMutation.mutate({
            description: formData.description,
            amount: Number(formData.amount),
            type: formData.type,
            date: formData.date,
            account_id: Number(formData.account_id),
            category_id: Number(formData.category_id),
            person_id: formData.person_id ? Number(formData.person_id) : null,
            channel_id: formData.channel_id ? Number(formData.channel_id) : null,
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
                    <h1 className="text-4xl font-bold premium-gradient-text tracking-tight mb-2">Transacciones</h1>
                    <p className="text-muted-foreground">Registro histórico de todos tus movimientos financieros.</p>
                </div>
                <PremiumButton onClick={() => setIsAdding(true)} className="h-12 shadow-indigo-500/20">
                    <Plus size={20} /> Nueva Transacción
                </PremiumButton>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mb-8"
                    >
                        <PremiumCard>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2 lg:col-span-2">
                                    <label className="text-sm text-muted-foreground">Descripción</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        placeholder="Ej. Compra supermercado..."
                                    />
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
                                    <label className="text-sm text-muted-foreground">Tipo</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    >
                                        <option value="expense">Gasto</option>
                                        <option value="income">Ingreso</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Cuenta</label>
                                    <select
                                        required
                                        value={formData.account_id}
                                        onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    >
                                        <option value="">Selecciona cuenta</option>
                                        {accounts?.map((acc: Account) => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Categoría</label>
                                    <select
                                        required
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    >
                                        <option value="">Selecciona categoría</option>
                                        {categories?.filter(c => (c as Category).type === formData.type).map((cat: Category) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Persona (Opcional)</label>
                                    <select
                                        value={formData.person_id}
                                        onChange={(e) => setFormData({ ...formData, person_id: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    >
                                        <option value="">Para quién...</option>
                                        {people?.map((p: Person) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
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

                                <div className="lg:col-span-4 flex gap-3 pt-4 border-t border-white/5">
                                    <PremiumButton type="submit" disabled={createMutation.isPending} className="px-12">
                                        {createMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : 'Registrar Transacción'}
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
                    <h2 className="text-xl font-bold text-white">Historial de Movimientos</h2>
                </div>

                <div className="space-y-3">
                    {transactions?.map((tx: Transaction, idx: number) => (
                        <PremiumCard key={tx.id} delay={idx * 0.05} className="!p-4 group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                        {tx.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-white">{tx.description || 'Sin descripción'}</p>
                                            {tx.person && (
                                                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full border border-indigo-500/30 uppercase font-bold tracking-wider">
                                                    {tx.person.name}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {tx.account?.name} • <span className="text-white/40">{tx.category?.name}</span> • {tx.date}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-lg font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </PremiumCard>
                    ))}

                    {transactions?.length === 0 && (
                        <div className="text-center py-20 glass-card rounded-2xl border-dashed border-white/10">
                            <Clock size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                            <p className="text-muted-foreground text-lg">Aún no hay transacciones registradas.</p>
                            <button onClick={() => setIsAdding(true)} className="text-indigo-400 font-medium hover:underline mt-2">
                                Registrar la primera
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
