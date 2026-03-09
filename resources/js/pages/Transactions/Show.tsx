import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import Toast from '@/components/Toast';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Edit, Trash2, ArrowLeft, FileText, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface TransactionData {
    id: number;
    title: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    categoryId: number;
    date: string;
    receipt: {
        id: number;
        fileName: string;
        filePath: string;
        extractedData: any;
    } | null;
}

export default function ShowTransaction() {
    const { transaction } = usePage().props as any;
    const data = transaction as TransactionData;
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteToast, setDeleteToast] = useState<{ show: boolean; message: string } | null>(null);

    const handleDelete = () => {
        setDeleteToast({
            show: true,
            message: '¿Estás seguro de que deseas eliminar esta transacción? Esta acción no se puede deshacer.'
        });
    };

    const confirmDelete = () => {
        setIsDeleting(true);
        setDeleteToast(null);
        router.delete(`/transactions/${data.id}`, {
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <AppLayout title={data.title}>
            <div className="max-w-3xl mx-auto">
                <Card>
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="border-b border-slate-700 pb-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-white">{data.title}</h1>
                                    <p className="text-slate-400 mt-1">{data.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-3xl font-bold ${
                                        data.type === 'income' ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {data.type === 'income' ? '+' : '-'}${data.amount.toLocaleString('es-CO')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Categoría</p>
                                <p className="text-white font-medium">{data.category}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Tipo</p>
                                <div className="flex items-center gap-2">
                                    {data.type === 'income' ? (
                                        <>
                                            <TrendingUp className="w-5 h-5 text-green-400" />
                                            <p className="text-white font-medium">Ingreso</p>
                                        </>
                                    ) : (
                                        <>
                                            <TrendingDown className="w-5 h-5 text-red-400" />
                                            <p className="text-white font-medium">Gasto</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {data.description && (
                            <div>
                                <p className="text-slate-400 text-sm mb-2">Descripción</p>
                                <p className="text-white whitespace-pre-wrap">{data.description}</p>
                            </div>
                        )}

                        {/* Receipt */}
                        {data.receipt && (
                            <div className="border-t border-slate-700 pt-6">
                                <p className="text-slate-400 text-sm mb-3">Recibo</p>
                                <div className="bg-slate-700/50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 text-white mb-2">
                                        <FileText className="w-5 h-5" />
                                        <p>{data.receipt.fileName}</p>
                                    </div>
                                    <a
                                        href={`/receipts/${data.receipt.id}/download`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                                    >
                                        Ver documento
                                    </a>
                                </div>

                                {data.receipt.extractedData && (
                                    <div className="mt-4">
                                        <p className="text-sm text-slate-400 mb-2">Datos Extraídos</p>
                                        <div className="bg-slate-700/30 p-3 rounded text-sm text-slate-300">
                                            <pre className="whitespace-pre-wrap">
                                                {JSON.stringify(data.receipt.extractedData, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-6 border-t border-slate-700">
                            <Link
                                href={`/transactions/${data.id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                Editar
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 className="w-4 h-4" />
                                {isDeleting ? 'Eliminando...' : 'Eliminar'}
                            </button>
                            <Link
                                href="/transactions"
                                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors ml-auto"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Volver
                            </Link>
                        </div>
                    </div>
                </Card>

                {/* Delete Confirmation Modal */}
                {deleteToast?.show && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-800 rounded-lg p-6 max-w-sm border border-slate-700">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertCircle className="w-6 h-6 text-yellow-400" />
                                <h3 className="text-lg font-semibold text-white">Confirmar eliminación</h3>
                            </div>
                            <p className="text-slate-400 mb-6">{deleteToast.message}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteToast(null)}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
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
