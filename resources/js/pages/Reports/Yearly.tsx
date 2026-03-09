import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import StatCard from '@/components/StatCard';
import { usePage } from '@inertiajs/react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function YearlyReport() {
    const { year, monthlyReports, totals } = usePage().props as any;

    return (
        <AppLayout title={`Reporte Anual - ${year}`}>
            <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        label="Ingresos Totales"
                        value={`$${totals.totalIncome.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`}
                        icon="trending-up"
                        color="bg-green-500/20"
                    />
                    <StatCard
                        label="Gastos Totales"
                        value={`$${totals.totalExpense.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`}
                        icon="trending-down"
                        color="bg-red-500/20"
                    />
                    <StatCard
                        label="Balance Anual"
                        value={`$${totals.netBalance.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`}
                        icon="wallet"
                        color={totals.netBalance >= 0 ? 'bg-indigo-500/20' : 'bg-red-500/20'}
                    />
                </div>

                {/* Monthly Breakdown */}
                <Card title="Desglose Mensual">
                    {monthlyReports.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-300">Mes</th>
                                        <th className="text-right py-3 px-4 font-semibold text-slate-300">Ingresos</th>
                                        <th className="text-right py-3 px-4 font-semibold text-slate-300">Gastos</th>
                                        <th className="text-right py-3 px-4 font-semibold text-slate-300">Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyReports.map((month: any) => (
                                        <tr key={month.month} className="border-b border-slate-700 hover:bg-slate-700/30">
                                            <td className="py-3 px-4 text-white font-medium">{month.monthName}</td>
                                            <td className="py-3 px-4 text-right text-green-400">
                                                ${month.totalIncome.toLocaleString('es-CO')}
                                            </td>
                                            <td className="py-3 px-4 text-right text-red-400">
                                                ${month.totalExpense.toLocaleString('es-CO')}
                                            </td>
                                            <td className={`py-3 px-4 text-right font-semibold ${
                                                month.netBalance >= 0 ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                ${month.netBalance.toLocaleString('es-CO')}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-slate-700/50 border-t-2 border-slate-600">
                                        <td className="py-3 px-4 font-bold text-white">Total</td>
                                        <td className="py-3 px-4 text-right font-bold text-green-400">
                                            ${totals.totalIncome.toLocaleString('es-CO')}
                                        </td>
                                        <td className="py-3 px-4 text-right font-bold text-red-400">
                                            ${totals.totalExpense.toLocaleString('es-CO')}
                                        </td>
                                        <td className={`py-3 px-4 text-right font-bold ${
                                            totals.netBalance >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            ${totals.netBalance.toLocaleString('es-CO')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-slate-400 py-8">Sin datos del año</p>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
