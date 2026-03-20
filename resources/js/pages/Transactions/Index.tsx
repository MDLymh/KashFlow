import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import { Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Eye, Edit, Trash2, AlertCircle, Inbox, Plus } from 'lucide-react';
import { useState } from 'react';
import { usePage } from '@inertiajs/react';

interface Transaction {
    id: number;
    title: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    categoryColor: string;
    date: string;
    hasReceipt: boolean;
}

export default function TransactionsList() {
    const { transactions, categories, currentMonth, currentYear } = usePage().props as any;
    const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number | null } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const filteredTransactions = transactions.filter((t: Transaction) => {
        if (selectedType === 'all') return true;
        return t.type === selectedType;
    });

    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    return (
        <AppLayout title={`Transacciones - ${monthNames[currentMonth - 1]} ${currentYear}`}>
            <div className="space-y-6">
                {/* Filter Controls */}
                <Card>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/transactions?month=${previousMonth}&year=${previousYear}`}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <ChevronLeft size={20} className="text-gray-600 dark:text-slate-400" />
                            </Link>
                            <span className="text-lg font-semibold text-gray-900 dark:text-white min-w-40 text-center">
                                {monthNames[currentMonth - 1]} {currentYear}
                            </span>
                            <Link
                                href={`/transactions?month=${nextMonth}&year=${nextYear}`}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <ChevronRight size={20} className="text-gray-600 dark:text-slate-400" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelectedType('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    selectedType === 'all'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                                }`}
                            >
                                Todas
                            </button>
                            <button
                                onClick={() => setSelectedType('income')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    selectedType === 'income'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                                }`}
                            >
                                Ingresos
                            </button>
                            <button
                                onClick={() => setSelectedType('expense')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    selectedType === 'expense'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                                }`}
                            >
                                Gastos
                            </button>
                        </div>

                        <Link
                            href="/transactions/create"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Nueva
                        </Link>
                    </div>
                </Card>

                {/* Transactions List */}
                <Card>
                    {filteredTransactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-slate-700">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-slate-300">Fecha</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-slate-300">Título</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-slate-300">Categoría</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-slate-300">Monto</th>
                                        <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-slate-300">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((transaction: Transaction) => (
                                        <tr
                                            key={transaction.id}
                                            className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700/30 transition-colors"
                                        >
                                            <td className="py-3 px-4 text-gray-600 dark:text-slate-400">{transaction.date}</td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{transaction.title}</p>
                                                    {transaction.description && (
                                                        <p className="text-xs text-gray-600 dark:text-slate-400 truncate">{transaction.description}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className="px-2 py-1 rounded text-xs font-medium text-white"
                                                    style={{ backgroundColor: transaction.categoryColor + '40', color: transaction.categoryColor }}
                                                >
                                                    {transaction.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className={`font-semibold ${
                                                    transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                                }`}>
                                                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString('es-CO')}
                                                </p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                                    <Link
                                                        href={`/transactions/${transaction.id}`}
                                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors flex items-center gap-1"
                                                    >
                                                        <Eye size={14} />
                                                        Ver
                                                    </Link>
                                                    <Link
                                                        href={`/transactions/${transaction.id}/edit`}
                                                        className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors flex items-center gap-1"
                                                    >
                                                        <Edit size={14} />
                                                        Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteConfirm({ show: true, id: transaction.id })}
                                                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors flex items-center gap-1"
                                                    >
                                                        <Trash2 size={14} />
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Inbox size={48} className="mx-auto text-gray-400 dark:text-slate-400 mb-4" />
                            <p className="text-gray-600 dark:text-slate-400">No hay transacciones para este período</p>
                            <Link
                                href="/transactions/create"
                                className="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                            >
                                Crear la primera transacción
                            </Link>
                        </div>
                    )}
                </Card>

                {/* Delete Confirmation Modal */}
                {deleteConfirm?.show && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm border border-gray-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirmar eliminación</h3>
                            </div>
                            <p className="text-gray-600 dark:text-slate-400 mb-6">¿Estás seguro de que deseas eliminar esta transacción? Esta acción no se puede deshacer.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        if (deleteConfirm.id) {
                                            setIsDeleting(true);
                                            router.delete(`/transactions/${deleteConfirm.id}`, {
                                                onFinish: () => {
                                                    setIsDeleting(false);
                                                    setDeleteConfirm(null);
                                                }
                                            });
                                        }
                                    }}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
