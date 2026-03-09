import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import { usePage, Link } from '@inertiajs/react';
import { Download, ArrowLeft, FileText } from 'lucide-react';

interface Receipt {
    id: number;
    fileName: string;
    filePath: string;
    fileType: string;
    extractedData?: {
        vendor?: string;
        amount?: string;
        date?: string;
        description?: string;
        category?: string;
        [key: string]: any;
    };
    transaction?: {
        id: number;
        title: string;
        amount: number;
    };
}

export default function ReceiptShow() {
    const { receipt } = usePage().props as any;

    const isImage = receipt.fileType.includes('image');
    const isPdf = receipt.fileType.includes('pdf');

    return (
        <AppLayout title={`Recibo - ${receipt.fileName}`}>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <Link
                        href="/receipts"
                        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a recibos
                    </Link>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* File Preview */}
                    <div className="lg:col-span-2">
                        <Card title="Vista Previa del Archivo">
                            <div className="bg-slate-800 rounded-lg p-8 min-h-96 flex items-center justify-center">
                                {isImage ? (
                                    <img
                                        src={`/receipts/${receipt.id}/download`}
                                        alt={receipt.fileName}
                                        className="max-w-full max-h-96 rounded-lg"
                                    />
                                ) : isPdf ? (
                                    <div className="text-center">
                                        <FileText className="w-24 h-24 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-400 mb-4">Archivo PDF: {receipt.fileName}</p>
                                        <a
                                            href={`/receipts/${receipt.id}/download`}
                                            download={receipt.fileName}
                                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            Descargar PDF
                                        </a>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <FileText className="w-24 h-24 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-400">Tipo de archivo no soportado: {receipt.fileType}</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Download Button */}
                        {!isImage && (
                            <div className="mt-4">
                                <a
                                    href={`/receipts/${receipt.id}/download`}
                                    download={receipt.fileName}
                                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded transition-colors font-medium"
                                >
                                    <Download className="w-4 h-4" />
                                    Descargar Archivo
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Details Sidebar */}
                    <div className="space-y-4">
                        {/* File Information */}
                        <Card title="Información del Archivo">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wide">Nombre</p>
                                    <p className="text-white font-medium mt-1">{receipt.fileName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wide">Tipo</p>
                                    <p className="text-white font-medium mt-1">{receipt.fileType}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Extracted Data */}
                        {receipt.extractedData && Object.keys(receipt.extractedData).length > 0 && (
                            <Card title="Datos Extraídos">
                                <div className="space-y-3">
                                    {receipt.extractedData.vendor && (
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-wide">Proveedor</p>
                                            <p className="text-white font-medium mt-1">{receipt.extractedData.vendor}</p>
                                        </div>
                                    )}
                                    {receipt.extractedData.amount && (
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-wide">Monto</p>
                                            <p className="text-white font-medium mt-1">{receipt.extractedData.amount}</p>
                                        </div>
                                    )}
                                    {receipt.extractedData.date && (
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-wide">Fecha</p>
                                            <p className="text-white font-medium mt-1">{receipt.extractedData.date}</p>
                                        </div>
                                    )}
                                    {receipt.extractedData.category && (
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-wide">Categoría</p>
                                            <p className="text-white font-medium mt-1">{receipt.extractedData.category}</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Transaction Link */}
                        {receipt.transaction && (
                            <Card title="Transacción Vinculada">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide">Concepto</p>
                                        <p className="text-white font-medium mt-1">{receipt.transaction.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide">Monto</p>
                                        <p className="text-white font-medium mt-1">
                                            ${receipt.transaction.amount.toFixed(2)}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/transactions/${receipt.transaction.id}`}
                                        className="block w-full text-center bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded transition-colors text-sm"
                                    >
                                        Ver Transacción
                                    </Link>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
