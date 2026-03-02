import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    CreditCard,
    Users,
    Tag,
    LogOut,
    ChevronRight,
    RefreshCw,
    History
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import type { AuthState } from '../store/authStore';

const SidebarItem = ({ icon: Icon, label, path, active }: { icon: LucideIcon, label: string, path: string, active: boolean }) => (
    <Link to={path}>
        <motion.div
            whileHover={{ x: 4 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10'
                : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                }`}
        >
            <Icon size={20} />
            <span className="font-medium flex-1">{label}</span>
            {active && <ChevronRight size={16} className="text-indigo-400" />}
        </motion.div>
    </Link>
);

export const AppLayout = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const clearAuth = useAuthStore((state: AuthState) => state.clearAuth);
    const user = useAuthStore((state: AuthState) => state.user);

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: CreditCard, label: 'Cuentas', path: '/accounts' },
        { icon: History, label: 'Transacciones', path: '/transactions' },
        { icon: RefreshCw, label: 'Transferencias', path: '/transfers' },
        { icon: Tag, label: 'Categorías', path: '/categories' },
        { icon: Users, label: 'Personas', path: '/people' },
    ];

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-72 border-r border-white/5 bg-black/20 backdrop-blur-xl p-6 flex flex-col sticky top-0 h-screen">
                <div className="mb-10 px-4">
                    <h2 className="text-2xl font-bold premium-gradient-text tracking-tight">Finanzas Pro</h2>
                </div>

                <nav className="space-y-2 flex-1">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                        />
                    ))}
                </nav>

                <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
                    <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Usuario</p>
                        <p className="text-white font-medium truncate">{user?.name}</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-400/10 transition-all border border-transparent hover:border-rose-400/20"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Cerrar Sesión</span>
                    </motion.button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};
