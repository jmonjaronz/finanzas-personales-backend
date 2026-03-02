import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PremiumCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export const PremiumCard = ({ children, className = '', delay = 0 }: PremiumCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`glass-card p-6 rounded-2xl overflow-hidden relative group ${className}`}
        >
            <div className="absolute inset-0 bg-glass-gradient pointer-events-none" />
            <div className="relative z-10">
                {children}
            </div>

            {/* Interactive hover glow */}
            <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
    );
};
