import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
}

export default function Card({ children, className = '', title, subtitle }: CardProps) {
    return (
        <div className={`bg-slate-800 rounded-lg border border-slate-700 shadow-lg overflow-hidden ${className}`}>
            {(title || subtitle) && (
                <div className="px-6 py-4 border-b border-slate-700 bg-slate-850">
                    {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
                    {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
                </div>
            )}
            <div className="px-6 py-4">
                {children}
            </div>
        </div>
    );
}
