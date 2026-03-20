import { ReactNode } from 'react';

interface FilterButtonProps {
    isActive: boolean;
    onClick: () => void;
    color?: 'indigo' | 'green' | 'red' | 'gray';
    children: ReactNode;
}

const colorClasses = {
    indigo: 'bg-indigo-600 text-white',
    green: 'bg-green-600 text-white',
    red: 'bg-red-600 text-white',
    gray: 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600',
};

export default function FilterButton({ isActive, onClick, color = 'gray', children }: FilterButtonProps) {
    const baseClass = 'px-4 py-2 rounded-lg transition-colors font-medium';
    const activeClass = colorClasses[color];
    const inactiveClass = 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600';

    return (
        <button
            onClick={onClick}
            className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
        >
            {children}
        </button>
    );
}
