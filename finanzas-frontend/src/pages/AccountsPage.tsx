import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Plus, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PremiumCard } from '../components/PremiumCard';
import { PremiumButton } from '../components/PremiumButton';
import { dataService } from '../services/dataService';
import { motion, AnimatePresence } from 'framer-motion';
import type { Account } from '../types';

export const AccountsPage = () => {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'banco',
        initial_balance: '',
    });

    const { data: accounts, isLoading } = useQuery({
        queryKey: ['accounts'],
        queryFn: dataService.getAccounts,
    });

    const createMutation = useMutation({
        mutationFn: dataService.createAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            setIsAdding(false);
            setFormData({ name: '', type: 'banco', initial_balance: '' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: dataService.deleteAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.initial_balance) return;
        createMutation.mutate({
            name: formData.name,
            type: formData.type,
            initial_balance: Number(formData.initial_balance),
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
            </div>
        );
    }

    const getColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'banco': return 'indigo';
            case 'efectivo': return 'emerald';
            case 'tarjeta': return 'rose';
            case 'ahorros': return 'blue';
            case 'inversion': return 'amber';
            default: return 'slate';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-bold premium-gradient-text tracking-tight mb-2">Mis Cuentas</h1>
                    <p className="text-muted-foreground">Gestiona tus fuentes de dinero y consulta sus saldos en tiempo real.</p>
                </div>
                <PremiumButton onClick={() => setIsAdding(true)} className="h-12">
                    <Plus size={20} /> Nueva Cuenta
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
                        <PremiumCard className="max-w-xl">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm text-muted-foreground">Nombre de la Cuenta</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        placeholder="Ej. BCP Principal, Efectivo, Ahorros BBVA..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Tipo</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    >
                                        <option value="banco">Banco</option>
                                        <option value="efectivo">Efectivo</option>
                                        <option value="tarjeta">Tarjeta Crédito</option>
                                        <option value="ahorros">Ahorros</option>
                                        <option value="inversion">Inversión</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Saldo Inicial</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.initial_balance}
                                        onChange={(e) => setFormData({ ...formData, initial_balance: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="md:col-span-2 flex gap-3 pt-2">
                                    <PremiumButton type="submit" disabled={createMutation.isPending} className="flex-1">
                                        {createMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : 'Crear Cuenta'}
                                    </PremiumButton>
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="px-6 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/5 font-semibold"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </PremiumCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts?.map((acc: Account, idx: number) => {
                    const color = getColor(acc.type);
                    return (
                        <PremiumCard key={acc.id} delay={idx * 0.1} className="group overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
                                    <CreditCard size={24} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                        {acc.type}
                                    </span>
                                    <button
                                        onClick={() => deleteMutation.mutate(acc.id)}
                                        className="p-1.5 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-400/10 rounded-lg"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{acc.name}</h3>
                            <p className={`text-3xl font-black ${acc.current_balance >= 0 ? 'text-white' : 'text-rose-400'}`}>
                                ${Number(acc.current_balance).toLocaleString()}
                            </p>

                            <div className="mt-8 pt-6 border-t border-white/5 flex gap-2">
                                <button className="flex-1 bg-white/3 hover:bg-white/7 py-2.5 rounded-xl text-xs font-semibold transition-all border border-white/5 hover:border-indigo-500/20 text-muted-foreground hover:text-white">
                                    Ver Detalles
                                </button>
                                <button className="flex-1 bg-white/3 hover:bg-white/7 py-2.5 rounded-xl text-xs font-semibold transition-all border border-white/5 hover:border-indigo-500/20 text-muted-foreground hover:text-white">
                                    Historial
                                </button>
                            </div>
                        </PremiumCard>
                    );
                })}

                {accounts?.length === 0 && !isAdding && (
                    <div className="col-span-full py-20 text-center glass-card rounded-2xl border-dashed border-white/10">
                        <CreditCard size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                        <p className="text-muted-foreground text-lg">No tienes cuentas registradas.</p>
                        <button onClick={() => setIsAdding(true)} className="text-indigo-400 font-medium hover:underline mt-2">
                            Crear tu primera cuenta
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
