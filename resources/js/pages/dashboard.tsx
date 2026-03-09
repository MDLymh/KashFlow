import { useState, useMemo } from 'react';
import AppLayout from '@/layouts/AppLayout';
import StatCard from '@/components/StatCard';
import Card from '@/components/Card';
import { Link } from '@inertiajs/react';
import { TrendingUp, TrendingDown, DollarSign, Plus, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface DashboardProps {
    currentMonth?: string;
    income?: number;
    expenses?: number;
    balance?: number;
    transactionCount?: number;
    categoryBreakdown?: Array<{
        category: string;
        amount: number;
        count: number;
        color: string;
    }>;
    expensesByCategory?: Array<{
        category: string;
        amount: number;
        count: number;
        color: string;
    }>;
    incomeByCategory?: Array<{
        category: string;
        amount: number;
        count: number;
        color: string;
    }>;
    recentTransactions?: Array<{
        id: number;
        title: string;
        amount: number;
        type: 'income' | 'expense';
        category: string;
        date: string;
    }>;
    weeklyData?: Array<{
        period: string;
        income: number;
        expenses: number;
        balance: number;
    }>;
    monthlyData?: Array<{
        period: string;
        income: number;
        expenses: number;
        balance: number;
    }>;
    yearlyData?: Array<{
        period: string;
        income: number;
        expenses: number;
        balance: number;
    }>;
}

export default function Dashboard({
    currentMonth = '',
    income = 0,
    expenses = 0,
    balance = 0,
    transactionCount = 0,
    categoryBreakdown = [],
    expensesByCategory = [],
    incomeByCategory = [],
    recentTransactions = [],
    weeklyData = [],
    monthlyData = [],
    yearlyData = [],
}: DashboardProps) {
    const [temporality, setTemporality] = useState<'week' | 'month' | 'year'>('week');
    const [chartType, setChartType] = useState<'comparison' | 'categories'>('comparison');
    const [comparisonChartType, setComparisonChartType] = useState<'line' | 'bar' | 'area'>('line');
    const [categoryType, setCategoryType] = useState<'expenses' | 'income'>('expenses');

    // Handle undefined or invalid currentMonth (format: YYYY-MM)
    const monthParts = currentMonth ? currentMonth.split('-') : [String(new Date().getFullYear()), String(new Date().getMonth() + 1).padStart(2, '0')];
    const [yearStr, monthStr] = monthParts;
    const year = yearStr;
    const month = monthStr;
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Get temporal data based on selected temporality
    const temporalData = useMemo(() => {
        if (temporality === 'week') return weeklyData;
        if (temporality === 'month') return monthlyData;
        return yearlyData;
    }, [temporality, weeklyData, monthlyData, yearlyData]);

    // Prepare data for categories chart
    const categoryChartData = useMemo(() => {
        const sourceData = categoryType === 'expenses' ? expensesByCategory : incomeByCategory;
        
        const total = sourceData.reduce((sum, cat) => sum + cat.amount, 0);
        if (total === 0) return [];
        
        return sourceData.map((cat) => ({
            ...cat,
            percentage: ((cat.amount / total) * 100).toFixed(1),
        }));
    }, [expensesByCategory, incomeByCategory, categoryType]);

    // Check if there's data to show
    const hasComparisonData = temporalData.some(d => (d.income > 0 || d.expenses > 0));
    const hasCategoryData = categoryChartData.length > 0;

    // Colors for pie chart
    const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'];

    return (
        <AppLayout 
            title={`${monthNames[parseInt(month) - 1]} ${year}`}
            headerAction={
                <Link
                    href="/transactions/create"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                    <Plus size={18} />
                    Nueva Transacción
                </Link>
            }
        >
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    label="Ingresos"
                    value={`$${income.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`}
                    icon="trending-up"
                    color="bg-green-500/20"
                />
                <StatCard
                    label="Gastos"
                    value={`$${expenses.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`}
                    icon="trending-down"
                    color="bg-red-500/20"
                />
                <StatCard
                    label="Balance"
                    value={`$${balance.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`}
                    icon="wallet"
                    color={balance >= 0 ? 'bg-indigo-500/20' : 'bg-red-500/20'}
                />
                <StatCard
                    label="Transacciones"
                    value={transactionCount}
                    icon="bar-chart-3"
                    color="bg-blue-500/20"
                />
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                {/* Charts Section */}
                <Card title="Análisis Financiero">
                    <div className="space-y-4">
                        {/* Chart Type Selector */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setChartType('comparison')}
                                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                        chartType === 'comparison'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                                >
                                    <BarChart3 size={18} />
                                    Ingresos vs Gastos
                                </button>
                                <button
                                    onClick={() => setChartType('categories')}
                                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                        chartType === 'categories'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                                >
                                    <PieChartIcon size={18} />
                                    Por Categoría
                                </button>
                            </div>
                        </div>

                        {/* Comparison Chart Section */}
                        {chartType === 'comparison' && (
                            <div className="space-y-4">
                                {/* Temporality and Chart Type Selectors */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex gap-2">
                                        <span className="text-sm text-slate-400 py-2">Período:</span>
                                        <button
                                            onClick={() => setTemporality('week')}
                                            className={`px-3 py-2 rounded text-sm transition-colors ${
                                                temporality === 'week'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            }`}
                                        >
                                            Semanal
                                        </button>
                                        <button
                                            onClick={() => setTemporality('month')}
                                            className={`px-3 py-2 rounded text-sm transition-colors ${
                                                temporality === 'month'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            }`}
                                        >
                                            Mensual
                                        </button>
                                        <button
                                            onClick={() => setTemporality('year')}
                                            className={`px-3 py-2 rounded text-sm transition-colors ${
                                                temporality === 'year'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            }`}
                                        >
                                            Anual
                                        </button>
                                    </div>

                                    <div className="flex gap-2">
                                        <span className="text-sm text-slate-400 py-2">Tipo:</span>
                                        <button
                                            onClick={() => setComparisonChartType('line')}
                                            className={`px-3 py-2 rounded text-sm transition-colors ${
                                                comparisonChartType === 'line'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            }`}
                                        >
                                            Línea
                                        </button>
                                        <button
                                            onClick={() => setComparisonChartType('bar')}
                                            className={`px-3 py-2 rounded text-sm transition-colors ${
                                                comparisonChartType === 'bar'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            }`}
                                        >
                                            Barras
                                        </button>
                                        <button
                                            onClick={() => setComparisonChartType('area')}
                                            className={`px-3 py-2 rounded text-sm transition-colors ${
                                                comparisonChartType === 'area'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            }`}
                                        >
                                            Área
                                        </button>
                                    </div>
                                </div>

                                {/* Actual Chart */}
                                {hasComparisonData ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        {comparisonChartType === 'line' && (
                                            <LineChart data={temporalData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                <XAxis dataKey="period" stroke="#9CA3AF" />
                                                <YAxis stroke="#9CA3AF" />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                                    cursor={{ stroke: 'rgba(99, 102, 241, 0.5)' }}
                                                />
                                                <Legend />
                                                <Line type="monotone" dataKey="income" stroke="#34D399" dot={{ fill: '#34D399' }} name="Ingresos" />
                                                <Line type="monotone" dataKey="expenses" stroke="#F87171" dot={{ fill: '#F87171' }} name="Gastos" />
                                            </LineChart>
                                        )}
                                        {comparisonChartType === 'bar' && (
                                            <BarChart data={temporalData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                <XAxis dataKey="period" stroke="#9CA3AF" />
                                                <YAxis stroke="#9CA3AF" />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                                                />
                                                <Legend />
                                                <Bar dataKey="income" fill="#34D399" name="Ingresos" />
                                                <Bar dataKey="expenses" fill="#F87171" name="Gastos" />
                                            </BarChart>
                                        )}
                                        {comparisonChartType === 'area' && (
                                            <AreaChart data={temporalData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                <XAxis dataKey="period" stroke="#9CA3AF" />
                                                <YAxis stroke="#9CA3AF" />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                                                />
                                                <Legend />
                                                <Area type="monotone" dataKey="income" fill="#34D399" stroke="#34D399" fillOpacity={0.3} name="Ingresos" />
                                                <Area type="monotone" dataKey="expenses" fill="#F87171" stroke="#F87171" fillOpacity={0.3} name="Gastos" />
                                            </AreaChart>
                                        )}
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-slate-400">No hay datos para mostrar en este período</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Categories Chart Section */}
                        {chartType === 'categories' && (
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <span className="text-sm text-slate-400 py-2">Mostrar:</span>
                                    <button
                                        onClick={() => setCategoryType('expenses')}
                                        className={`px-3 py-2 rounded text-sm transition-colors ${
                                            categoryType === 'expenses'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        }`}
                                    >
                                        Gastos
                                    </button>
                                    <button
                                        onClick={() => setCategoryType('income')}
                                        className={`px-3 py-2 rounded text-sm transition-colors ${
                                            categoryType === 'income'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        }`}
                                    >
                                        Ingresos
                                    </button>
                                </div>

                                {hasCategoryData ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={categoryChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ payload, value }) => {
                                                    const total = categoryChartData.reduce((sum, c: any) => sum + c.amount, 0);
                                                    const percentage = ((value / total) * 100).toFixed(0);
                                                    return `${payload?.category}: ${percentage}%`;
                                                }}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="amount"
                                                nameKey="category"
                                            >
                                                {categoryChartData.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                                formatter={(value: any) => `$${value.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-slate-400">No hay datos de categorías para mostrar</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Recent Transactions */}
                {recentTransactions.length > 0 && (
                    <Card title="Transacciones Recientes">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-300">Fecha</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-300">Descripción</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-300">Categoría</th>
                                        <th className="text-right py-3 px-4 font-semibold text-slate-300">Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                                            <td className="py-3 px-4 text-slate-400">{transaction.date}</td>
                                            <td className="py-3 px-4 text-white">{transaction.title}</td>
                                            <td className="py-3 px-4">
                                                <span className="text-slate-300">{transaction.category}</span>
                                            </td>
                                            <td className={`py-3 px-4 text-right font-semibold ${
                                                transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString('es-CO')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
