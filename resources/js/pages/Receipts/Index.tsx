import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { usePage, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, Trash2, FileText, Inbox, Image, AlertCircle } from 'lucide-react';

interface Receipt {
    id: number;
    fileName: string;
    filePath: string;
    fileType: string;
    transaction?: {
        id: number;
        title: string;
    };
    extractedData?: any;
    createdAt: string;
}

export default function ReceiptsList() {
    const { receipts } = usePage().props as any;
    const [deleting, setDeleting] = useState<number | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ show: boolean; message: string; receiptId: number | null } | null>(null);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' } | null>(null);

    const handleDelete = (id: number) => {
        const receipt = receipts.find((r: Receipt) => r.id === id);
        setDeleteDialog({
            show: true,
            message: `¿Estás seguro de que deseas eliminar el recibo "${receipt.fileName}"? Esta acción no se puede deshacer.`,
            receiptId: id,
        });
    };

    const confirmDelete = () => {
        if (!deleteDialog?.receiptId) return;
        
        const id = deleteDialog.receiptId;
        setDeleting(id);
        setDeleteDialog(null);
        
        router.delete(`/receipts/${id}`, {
            onSuccess: () => {
                setDeleting(null);
                setToast({
                    show: true,
                    message: 'Recibo eliminado exitosamente',
                    type: 'success',
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            },
            onError: () => {
                setDeleting(null);
                setToast({
                    show: true,
                    message: 'Error al eliminar el recibo',
                    type: 'error',
                });
            },
        });
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) {
            return FileText;
        } else if (fileType.includes('image')) {
            return Image;
        }
        return FileText;
    };

    return (
        <AppLayout title="Recibos">
            <div className="space-y-6">
                {/* Receipts List */}
                <Card title="Recibos Cargados">
                    {receipts.length > 0 ? (
                        <div className="space-y-3">
                            {receipts.map((receipt: Receipt) => (
                                <div
                                    key={receipt.id}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors border border-gray-200 dark:border-slate-700"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="pt-1">
                                            {(() => {
                                                const IconComponent = getFileIcon(receipt.fileType);
                                                return <IconComponent size={32} className="text-gray-400 dark:text-slate-400" />;
                                            })()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">{receipt.fileName}</p>
                                            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                                                {receipt.transaction ? `Vinculado a: ${receipt.transaction.title}` : 'Sin vincular'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{receipt.createdAt}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/receipts/${receipt.id}`}
                                        >
                                            <Button type="button" size="sm" className="flex items-center gap-2">
                                                <Eye className="w-4 h-4" />
                                                Ver
                                            </Button>
                                        </Link>
                                        <Button
                                            type="button"
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(receipt.id)}
                                            disabled={deleting === receipt.id}
                                            className="flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            {deleting === receipt.id ? 'Eliminando...' : 'Eliminar'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Inbox size={48} className="mx-auto text-gray-400 dark:text-slate-400 mb-4" />
                            <p className="text-gray-600 dark:text-slate-400">No hay recibos cargados</p>
                            <p className="text-sm text-gray-500 dark:text-slate-500 mt-2">Los recibos se cargan automáticamente cuando creas una transacción</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteDialog?.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-lg p-6 max-w-sm border border-slate-700">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertCircle className="w-6 h-6 text-yellow-400" />
                            <h3 className="text-lg font-semibold text-white">Confirmar eliminación</h3>
                        </div>
                        <p className="text-slate-400 mb-6">{deleteDialog.message}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteDialog(null)}
                                disabled={deleting !== null}
                                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting !== null}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {deleting !== null ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast?.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={3000}
                    onClose={() => setToast(null)}
                />
            )}
        </AppLayout>
    );
}
