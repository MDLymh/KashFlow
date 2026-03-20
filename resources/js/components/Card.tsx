import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
}

export default function Card({ children, className = '', title, subtitle }: CardProps) {
    return (
        <div className={`bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-lg overflow-hidden ${className}`}>
            {(title || subtitle) && (
                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
                    {subtitle && <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{subtitle}</p>}
                </div>
            )}
            <div className="px-6 py-4 text-gray-900 dark:text-slate-100">
                {children}
            </div>
        </div>
    );
}
