import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import { useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Hourglass, CheckCircle, FileText } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
}

interface AnalysisResult {
    success: boolean;
    data?: {
        title: string;
        description: string;
        amount: number;
        category_id: number;
        merchant: string;
        date: string;
        confidence: number;
    };
    error?: string;
}

export default function CreateTransaction() {
    const { categories } = usePage().props as any;
    const [isDragActive, setIsDragActive] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisMessage, setAnalysisMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        amount: '',
        type: 'expense',
        category_id: '',
        transaction_date: new Date().toISOString().split('T')[0],
        receipt: null as File | null,
    });

    const filteredCategories = categories.filter(
        (c: Category) => c.type === data.type
    );

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true);
        } else if (e.type === 'dragleave') {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type)) {
                setData('receipt', file);
                analyzeReceipt(file);
            } else {
                setAnalysisMessage({
                    type: 'error',
                    text: 'Por favor sube una imagen (JPG, PNG) o PDF válido'
                });
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setData('receipt', file);
            analyzeReceipt(file);
        }
    };

    const analyzeReceipt = async (file: File) => {
        if (!file) return;

        setIsAnalyzing(true);
        setAnalysisMessage(null);

        try {
            const formData = new FormData();
            formData.append('receipt', file);

            // Obtener token CSRF del meta tag
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

            const response = await fetch('/receipts/analyze', {
                method: 'POST',
                body: formData,
                headers: csrfToken ? {
                    'X-CSRF-TOKEN': csrfToken,
                } : {},
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: AnalysisResult = await response.json();

            if (result.success && result.data) {
                // Rellenar automáticamente los campos
                setData('title', result.data.title || data.title);
                setData('description', result.data.description || data.description);
                setData('amount', result.data.amount?.toString() || data.amount);
                
                if (result.data.category_id) {
                    setData('category_id', result.data.category_id.toString());
                }
                
                if (result.data.date) {
                    setData('transaction_date', result.data.date);
                }

                setAnalysisMessage({
                    type: 'success',
                    text: `Recibo analizado con ${Math.round(result.data.confidence * 100)}% de confianza. Por favor verifica los datos.`
                });
            } else {
                setAnalysisMessage({
                    type: 'error',
                    text: result.error || 'No se pudo procesar la imagen. Completa los campos manualmente.'
                });
            }
        } catch (error) {
            setAnalysisMessage({
                type: 'error',
                text: 'Error al analizar la imagen. Por favor intenta de nuevo.'
            });
            console.error('Analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/transactions', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout title="Nueva Transacción">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-3">Tipo</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="income"
                                        checked={data.type === 'income'}
                                        onChange={(e) => {
                                            setData('type', e.target.value as 'income' | 'expense');
                                            setData('category_id', '');
                                        }}
                                        className="rounded"
                                    />
                                    <span className="text-green-400">Ingreso</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="expense"
                                        checked={data.type === 'expense'}
                                        onChange={(e) => {
                                            setData('type', e.target.value as 'income' | 'expense');
                                            setData('category_id', '');
                                        }}
                                        className="rounded"
                                    />
                                    <span className="text-red-400">Gasto</span>
                                </label>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Título</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                placeholder="Ej: Almuerzo con clientes"
                                required
                            />
                            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Descripción</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                placeholder="Detalles adicionales..."
                                rows={3}
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Monto</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                placeholder="0.00"
                                required
                            />
                            {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Categoría</label>
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {filteredCategories.map((cat: Category) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && <p className="text-red-400 text-sm mt-1">{errors.category_id}</p>}
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Fecha</label>
                            <input
                                type="date"
                                value={data.transaction_date}
                                onChange={(e) => setData('transaction_date', e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                required
                            />
                            {errors.transaction_date && <p className="text-red-400 text-sm mt-1">{errors.transaction_date}</p>}
                        </div>

                        {/* Receipt Upload with Drag and Drop */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Recibo (opcional)</label>
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                                    isDragActive
                                        ? 'border-indigo-500 bg-indigo-500/10'
                                        : 'border-slate-600 hover:border-indigo-500 hover:bg-slate-800/50'
                                } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="receipt-input"
                                    disabled={isAnalyzing}
                                />
                                <label htmlFor="receipt-input" className="cursor-pointer block">
                                    <div className="text-4xl mb-2">
                                        {isAnalyzing ? (
                                            <Hourglass size={40} className="mx-auto text-indigo-400" />
                                        ) : data.receipt ? (
                                            <CheckCircle size={40} className="mx-auto text-green-400" />
                                        ) : (
                                            <FileText size={40} className="mx-auto text-slate-400" />
                                        )}
                                    </div>
                                    {isAnalyzing ? (
                                        <>
                                            <p className="text-slate-300">Analizando recibo...</p>
                                            <p className="text-xs text-slate-400 mt-1">Extrayendo datos con IA</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-slate-300">
                                                {data.receipt ? 'Cambiar archivo' : 'Arrastra aquí o haz clic'}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">JPG, PNG o PDF (máx 10MB)</p>
                                        </>
                                    )}
                                </label>
                                {data.receipt && !isAnalyzing && (
                                    <p className="text-green-400 text-sm mt-2 flex items-center gap-2 justify-center">
                                        <CheckCircle size={14} />
                                        {data.receipt.name}
                                    </p>
                                )}
                            </div>

                            {/* Analysis Message */}
                            {analysisMessage && (
                                <div
                                    className={`mt-3 p-3 rounded-lg text-sm ${
                                        analysisMessage.type === 'success'
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}
                                >
                                    {analysisMessage.text}
                                </div>
                            )}

                            {errors.receipt && <p className="text-red-400 text-sm mt-1">{errors.receipt}</p>}
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={processing || isAnalyzing}
                                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Guardando...' : 'Guardar Transacción'}
                            </button>
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                disabled={processing || isAnalyzing}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
