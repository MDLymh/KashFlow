import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import StatCard from '@/components/StatCard';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from 'lucide-react';

export default function MonthlyReport() {
    const { report, transactions, categoryBreakdown, dates } = usePage().props as any;

    const income = report.totalIncome;
    const expenses = report.totalExpense;
    const balance = report.netBalance;

    return (
        <AppLayout title={`Reporte Mensual - ${dates.monthName} ${dates.year}`}>
            <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        value={report.incomeCount + report.expenseCount}
                        icon="bar-chart-3"
                        color="bg-blue-500/20"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Transactions List */}
                    <Card className="lg:col-span-2" title="Transacciones del Mes">
                        {transactions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            <th className="text-left py-3 px-3 font-semibold text-slate-300">Fecha</th>
                                            <th className="text-left py-3 px-3 font-semibold text-slate-300">Título</th>
                                            <th className="text-left py-3 px-3 font-semibold text-slate-300">Categoría</th>
                                            <th className="text-right py-3 px-3 font-semibold text-slate-300">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((t: any) => (
                                            <tr key={t.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                                                <td className="py-3 px-3 text-slate-400">{t.date}</td>
                                                <td className="py-3 px-3 text-white">{t.title}</td>
                                                <td className="py-3 px-3">
                                                    <span
                                                        className="px-2 py-1 rounded text-xs"
                                                        style={{ backgroundColor: t.categoryColor + '40' }}
                                                    >
                                                        {t.category}
                                                    </span>
                                                </td>
                                                <td className={`py-3 px-3 text-right font-semibold ${
                                                    t.type === 'income' ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString('es-CO')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-slate-400 py-8">Sin transacciones</p>
                        )}
                    </Card>

                    {/* Category Breakdown */}
                    <Card title="Distribución por Categoría">
                        <div className="space-y-4">
                            {categoryBreakdown.length > 0 ? (
                                categoryBreakdown.map((cat: any) => (
                                    <div key={cat.category}>
                                        <div className="flex justify-between mb-1">
                                            <p className="text-white font-medium">{cat.category}</p>
                                            <p className="text-slate-300">${cat.amount.toLocaleString('es-CO')}</p>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full"
                                                style={{
                                                    width: `${(cat.amount / Math.max(...categoryBreakdown.map((c: any) => c.amount))) * 100}%`,
                                                    backgroundColor: cat.color,
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">{cat.count} transacciones</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-center py-4">Sin categorías</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
