import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Tag, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { PremiumCard } from '../components/PremiumCard';
import { PremiumButton } from '../components/PremiumButton';
import { dataService } from '../services/dataService';
import type { Category } from '../types';

export const CategoriesPage = () => {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'expense' as 'income' | 'expense',
    });

    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: dataService.getCategories,
    });

    const createMutation = useMutation({
        mutationFn: dataService.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsAdding(false);
            setFormData({ name: '', type: 'expense' });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;
        createMutation.mutate(formData);
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
                    <h1 className="text-4xl font-bold premium-gradient-text tracking-tight mb-2">Categorías</h1>
                    <p className="text-muted-foreground">Organiza tus gastos e ingresos por categorías personalizadas.</p>
                </div>
                <PremiumButton onClick={() => setIsAdding(true)} variant="glass" className="h-12 border-indigo-500/20">
                    <Plus size={20} /> Nueva Categoría
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
                        <PremiumCard className="max-w-md">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h2 className="text-lg font-bold text-white mb-2">Añadir Categoría</h2>
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        autoFocus
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        placeholder="Ej. Comida, Salario, Transporte..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Tipo</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'expense' })}
                                            className={`py-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.type === 'expense' ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'}`}
                                        >
                                            <TrendingDown size={16} /> Gasto
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'income' })}
                                            className={`py-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.type === 'income' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'}`}
                                        >
                                            <TrendingUp size={16} /> Ingreso
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <PremiumButton type="submit" disabled={createMutation.isPending} className="flex-1">
                                        {createMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : 'Guardar'}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories?.map((cat: Category, idx: number) => (
                    <PremiumCard key={cat.id} delay={idx * 0.05} className="!p-4 hover:scale-[1.02] transition-transform cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${cat.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'} border border-white/5`}>
                                <Tag size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{cat.name}</h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">{cat.type === 'income' ? 'Ingreso' : 'Gasto'}</p>
                            </div>
                        </div>
                    </PremiumCard>
                ))}

                <motion.button
                    whileHover={{ scale: 0.98 }}
                    onClick={() => setIsAdding(true)}
                    className="border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center p-6 text-muted-foreground hover:text-white hover:border-white/10 transition-all gap-2 min-h-[84px]"
                >
                    <Plus size={24} strokeWidth={2} />
                    <span className="text-sm font-medium">Nueva Categoría</span>
                </motion.button>
            </div>
        </div>
    );
};
