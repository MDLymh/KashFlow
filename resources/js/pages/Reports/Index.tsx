import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import FormSelect from '@/components/FormSelect';
import FormInput from '@/components/FormInput';
import { usePage, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, TrendingDown, Filter, Calendar, Scale, BarChart3, Inbox } from 'lucide-react';

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    categoryColor: string;
    date: string;
}

interface CategoryBreakdown {
    category: string;
    amount: number;
    count: number;
    color: string;
}

interface MonthlyReport {
    month: number;
    monthName: string;
    income: number;
    expense: number;
    balance: number;
}

interface Totals {
    income: number;
    expense: number;
    balance: number;
}

interface Dates {
    month?: number;
    year?: number;
    monthName?: string;
    startDate?: string;
    endDate?: string;
}

export default function ReportsIndex() {
    const { 
        reportType: initialReportType, 
        transactions, 
        categoryBreakdown, 
        monthlyReports, 
        totals, 
        dates, 
        currentMonth, 
        currentYear,
        startDate: initialStartDate,
        endDate: initialEndDate,
    } = usePage().props as any;

    const [reportType, setReportType] = useState(initialReportType || 'monthly');
    const [month, setMonth] = useState(currentMonth || new Date().getMonth() + 1);
    const [year, setYear] = useState(currentYear || new Date().getFullYear());
    const [startDate, setStartDate] = useState(initialStartDate || '');
    const [endDate, setEndDate] = useState(initialEndDate || '');

    const handleFilterChange = () => {
        const params = new URLSearchParams();
        params.set('type', reportType);

        if (reportType === 'monthly') {
            params.set('month', month.toString());
            params.set('year', year.toString());
        } else if (reportType === 'yearly') {
            params.set('year', year.toString());
        } else if (reportType === 'custom' && startDate && endDate) {
            params.set('startDate', startDate);
            params.set('endDate', endDate);
        }

        window.location.href = `/reports?${params.toString()}`;
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        params.set('type', reportType);

        if (reportType === 'monthly') {
            params.set('month', month.toString());
            params.set('year', year.toString());
        } else if (reportType === 'custom' && startDate && endDate) {
            params.set('startDate', startDate);
            params.set('endDate', endDate);
        }

        window.location.href = `/reports/export?${params.toString()}`;
    };

    const chartData = useMemo(() => {
        if (reportType === 'yearly' && monthlyReports.length > 0) {
            return monthlyReports.map((m: MonthlyReport) => ({
                name: m.monthName,
                Ingresos: m.income,
                Gastos: m.expense,
                Saldo: m.balance,
            }));
        }
        return [];
    }, [reportType, monthlyReports]);

    const pieData = useMemo(() => {
        return categoryBreakdown.map((item: CategoryBreakdown) => ({
            name: item.category,
            value: item.amount,
            color: item.color,
        }));
    }, [categoryBreakdown]);

    const COLORS = ['#818CF8', '#F87171', '#FCD34D', '#34D399', '#60A5FA', '#F472B6'];

    return (
        <AppLayout title="Reportes">
            <div className="space-y-6">
                {/* Filter Card */}
                <Card>
                    <div className="flex items-end gap-4 flex-wrap">
                        <FormSelect
                            label="Tipo de Reporte"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            options={[
                                { value: 'monthly', label: 'Mensual' },
                                { value: 'yearly', label: 'Anual' },
                                { value: 'custom', label: 'Rango Personalizado' },
                            ]}
                            className="flex-1 min-w-[150px]"
                        />

                        {reportType === 'monthly' && (
                            <>
                                <FormSelect
                                    label="Mes"
                                    value={month}
                                    onChange={(e) => setMonth(parseInt(e.target.value))}
                                    options={Array.from({ length: 12 }, (_, i) => ({
                                        value: i + 1,
                                        label: new Date(0, i).toLocaleString('es-MX', { month: 'long' }),
                                    }))}
                                    className="flex-1 min-w-[150px]"
                                />
                                <FormInput
                                    label="Año"
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    className="flex-1 min-w-[150px]"
                                />
                            </>
                        )}

                        {reportType === 'yearly' && (
                            <FormInput
                                label="Año"
                                type="number"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                                className="flex-1 min-w-[150px]"
                            />
                        )}

                        {reportType === 'custom' && (
                            <>
                                <FormInput
                                    label="Fecha Inicio"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="flex-1 min-w-[200px]"
                                />
                                <FormInput
                                    label="Fecha Fin"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="flex-1 min-w-[200px]"
                                />
                            </>
                        )}

                        <button
                            onClick={handleFilterChange}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            Filtrar
                        </button>

                        {(reportType !== 'yearly') && (
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Descargar Excel
                            </button>
                        )}
                    </div>
                </Card>

                {/* Totals Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-slate-400 text-sm">Total Ingresos</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    ${totals.income.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-slate-400 text-sm">Total Gastos</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    ${totals.expense.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-slate-400 text-sm">Saldo</p>
                                <p className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                                    ${totals.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <Scale size={32} className={totals.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'} />
                        </div>
                    </Card>
                </div>

                {/* Charts Section */}
                {reportType === 'yearly' && chartData.length > 0 && (
                    <Card title="Comparativa Mensual">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" className="dark:stroke-slate-600" />
                                <XAxis dataKey="name" stroke="#6b7280" className="dark:stroke-slate-400" />
                                <YAxis stroke="#6b7280" className="dark:stroke-slate-400" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#000' }}
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="Ingresos" fill="#34D399" />
                                <Bar dataKey="Gastos" fill="#F87171" />
                                <Bar dataKey="Saldo" fill="#60A5FA" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                )}

                {categoryBreakdown.length > 0 && reportType !== 'yearly' && (
                    <Card title="Desglose por Categoría">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: $${value.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#000' }}
                                    formatter={(value: any) => `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                )}

                {/* Transactions Table */}
                {transactions.length > 0 && reportType !== 'yearly' && (
                    <Card title="Transacciones">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-slate-700">
                                        <th className="text-left py-3 px-4 text-gray-700 dark:text-slate-400 font-medium">Fecha</th>
                                        <th className="text-left py-3 px-4 text-gray-700 dark:text-slate-400 font-medium">Descripción</th>
                                        <th className="text-left py-3 px-4 text-gray-700 dark:text-slate-400 font-medium">Categoría</th>
                                        <th className="text-left py-3 px-4 text-gray-700 dark:text-slate-400 font-medium">Tipo</th>
                                        <th className="text-right py-3 px-4 text-gray-700 dark:text-slate-400 font-medium">Monto</th>
                                        <th className="text-left py-3 px-4 text-gray-700 dark:text-slate-400 font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction: Transaction) => (
                                        <tr key={transaction.id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="py-3 px-4 text-gray-900 dark:text-white text-sm">{transaction.date}</td>
                                            <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{transaction.title}</td>
                                            <td className="py-3 px-4">
                                                <span 
                                                    className="text-white text-sm font-medium"
                                                    style={{ backgroundColor: transaction.categoryColor, padding: '4px 8px', borderRadius: '4px' }}
                                                >
                                                    {transaction.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`text-sm font-medium ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">
                                                ${transaction.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="py-3 px-4">
                                                <Link 
                                                    href={`/transactions/${transaction.id}/edit`}
                                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium underline"
                                                >
                                                    Editar
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* Empty State */}
                {transactions.length === 0 && monthlyReports.length === 0 && (
                    <Card>
                        <div className="text-center py-12">
                            <BarChart3 size={48} className="mx-auto text-gray-400 dark:text-slate-400 mb-4" />
                            <p className="text-gray-600 dark:text-slate-400">No hay datos para mostrar en el período seleccionado</p>
                        </div>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
