import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import ConfirmDialog from '@/components/ConfirmDialog';
import { usePage, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Upload, Eye, Trash2, FileText, Inbox, Hourglass, Image } from 'lucide-react';

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
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState<number | null>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/receipts/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error uploading:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = (id: number) => {
        const receipt = receipts.find((r: Receipt) => r.id === id);
        setShowDeleteDialog(id);
    };

    const confirmDelete = (id: number) => {
        setDeleting(id);
        router.delete(`/receipts/${id}`, {
            onSuccess: () => {
                setDeleting(null);
                setShowDeleteDialog(null);
                window.location.reload();
            },
            onError: () => {
                setDeleting(null);
                setShowDeleteDialog(null);
                alert('Error al eliminar el recibo');
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
                {/* Upload Card */}
                <Card>
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors">
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,application/pdf"
                            onChange={handleUpload}
                            disabled={uploading}
                            id="receipt-upload"
                            className="hidden"
                        />
                        <label htmlFor="receipt-upload" className="cursor-pointer block">
                            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                            <p className="text-white font-medium">Arrastra archivos aquí o haz clic</p>
                            <p className="text-slate-400 text-sm mt-1">JPG, PNG o PDF (máx 10MB)</p>
                            {uploading && <p className="text-indigo-400 text-sm mt-2 flex items-center justify-center gap-2"><Hourglass size={14} /> Subiendo...</p>}
                        </label>
                    </div>
                </Card>

                {/* Receipts List */}
                <Card title="Recibos Cargados">
                    {receipts.length > 0 ? (
                        <div className="space-y-3">
                            {receipts.map((receipt: Receipt) => (
                                <div
                                    key={receipt.id}
                                    className="flex items-center justify-between p-4 hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-700"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="pt-1">
                                            {(() => {
                                                const IconComponent = getFileIcon(receipt.fileType);
                                                return <IconComponent size={32} className="text-slate-400" />;
                                            })()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-white">{receipt.fileName}</p>
                                            <p className="text-sm text-slate-400 mt-1">
                                                {receipt.transaction ? `Vinculado a: ${receipt.transaction.title}` : 'Sin vincular'}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">{receipt.createdAt}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/receipts/${receipt.id}`}
                                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded text-sm transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Ver
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(receipt.id)}
                                            disabled={deleting === receipt.id}
                                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            {deleting === receipt.id ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Inbox size={48} className="mx-auto text-slate-400 mb-4" />
                            <p className="text-slate-400">No hay recibos cargados</p>
                            <p className="text-sm text-slate-500 mt-2">Sube tus primeros recibos usando el formulario arriba</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog !== null}
                title="Eliminar Recibo"
                message="¿Estás seguro de que deseas eliminar este recibo? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                isDanger={true}
                isLoading={deleting !== null}
                onConfirm={() => confirmDelete(showDeleteDialog!)}
                onCancel={() => setShowDeleteDialog(null)}
            />
        </AppLayout>
    );
}
