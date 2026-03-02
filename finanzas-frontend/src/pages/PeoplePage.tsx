import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users, UserPlus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { PremiumCard } from '../components/PremiumCard';
import { PremiumButton } from '../components/PremiumButton';
import { dataService } from '../services/dataService';
import { motion, AnimatePresence } from 'framer-motion';
import type { Person } from '../types';

export const PeoplePage = () => {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');

    const { data: people, isLoading } = useQuery({
        queryKey: ['people'],
        queryFn: dataService.getPeople,
    });

    const createMutation = useMutation({
        mutationFn: dataService.createPerson,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['people'] });
            setIsAdding(false);
            setNewName('');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        createMutation.mutate({ name: newName });
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
                    <h1 className="text-4xl font-bold premium-gradient-text tracking-tight mb-2">Personas</h1>
                    <p className="text-muted-foreground">Gestiona a quiénes asignas tus gastos o ingresos (familia, amigos, clientes).</p>
                </div>
                <PremiumButton onClick={() => setIsAdding(true)} className="h-12">
                    <Plus size={20} /> Añadir Persona
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
                        <PremiumCard className="max-w-md">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h2 className="text-lg font-bold text-white mb-2">Nueva Persona</h2>
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Nombre</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        placeholder="Ej. Esposa, Hijo, Cliente A..."
                                    />
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
                {people?.map((person: Person, idx: number) => (
                    <PremiumCard key={person.id} delay={idx * 0.05} className="!p-4 hover:border-indigo-500/30 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                                <Users size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{person.name}</h3>
                                <p className="text-xs text-muted-foreground">Sistema Familiar</p>
                            </div>
                        </div>
                    </PremiumCard>
                ))}

                {people?.length === 0 && !isAdding && (
                    <div className="col-span-full py-12 text-center glass-card rounded-2xl border-dashed border-white/10">
                        <UserPlus size={40} className="mx-auto text-muted-foreground mb-3 opacity-20" />
                        <p className="text-muted-foreground">No has añadido personas todavía.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
