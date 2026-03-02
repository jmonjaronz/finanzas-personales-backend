import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface PremiumButtonProps extends Omit<HTMLMotionProps<'button'>, 'children' | 'variant'> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'glass';
}

export const PremiumButton = ({ children, variant = 'primary', className = '', ...props }: PremiumButtonProps) => {
    const variants = {
        primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40",
        secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/20",
        glass: "glass-card hover:bg-white/10 text-white border-white/10 hover:border-white/20",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};
