import { ReactNode } from 'react';

interface StatsCardProps {
    label: string;
    value: string;
    icon: ReactNode;
    color: 'green' | 'red' | 'blue';
}

const colorClasses = {
    green: {
        text: 'text-green-600 dark:text-green-400',
        icon: 'text-green-600 dark:text-green-400',
    },
    red: {
        text: 'text-red-600 dark:text-red-400',
        icon: 'text-red-600 dark:text-red-400',
    },
    blue: {
        text: 'text-blue-600 dark:text-blue-400',
        icon: 'text-blue-600 dark:text-blue-400',
    },
};

export default function StatsCard({ label, value, icon, color }: StatsCardProps) {
    const colors = colorClasses[color];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm dark:shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 dark:text-slate-400 text-sm">{label}</p>
                    <p className={`text-2xl font-bold ${colors.text} mt-2`}>
                        {value}
                    </p>
                </div>
                <div className={`w-12 h-12 flex items-center justify-center ${colors.icon}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
