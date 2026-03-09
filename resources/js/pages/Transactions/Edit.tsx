import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import { useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
}

interface TransactionData {
    id: number;
    title: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    categoryId: number;
    date: string;
}

export default function EditTransaction() {
    const { transaction, categories } = usePage().props as any;
    const txData = transaction as TransactionData;

    const { data, setData, patch, processing, errors } = useForm({
        title: txData.title,
        description: txData.description,
        amount: txData.amount.toString(),
        type: txData.type,
        category_id: txData.categoryId.toString(),
        transaction_date: txData.date,
    });

    const filteredCategories = categories.filter(
        (c: Category) => c.type === data.type
    );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        patch(`/transactions/${txData.id}`);
    };

    return (
        <AppLayout title={`Editar: ${txData.title}`}>
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

                        {/* Submit */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                disabled={processing}
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
