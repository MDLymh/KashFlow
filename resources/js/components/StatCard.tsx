import { TrendingUp, TrendingDown, Wallet, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: 'trending-up' | 'trending-down' | 'wallet' | 'bar-chart-3';
    color: string;
    change?: number;
    trend?: 'up' | 'down';
}

export default function StatCard({ label, value, icon, color, change, trend }: StatCardProps) {
    const getIcon = () => {
        switch (icon) {
            case 'trending-up':
                return <TrendingUp size={32} className="text-green-500 dark:text-green-400" />;
            case 'trending-down':
                return <TrendingDown size={32} className="text-red-500 dark:text-red-400" />;
            case 'wallet':
                return <Wallet size={32} className="text-indigo-500 dark:text-indigo-400" />;
            case 'bar-chart-3':
                return <BarChart3 size={32} className="text-blue-500 dark:text-blue-400" />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm dark:shadow-lg">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-600 dark:text-slate-400 text-sm font-medium">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
                    {change !== undefined && (
                        <p className={`text-sm mt-2 flex items-center gap-1 ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            {change}%
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    {getIcon()}
                </div>
            </div>
        </div>
    );
}
