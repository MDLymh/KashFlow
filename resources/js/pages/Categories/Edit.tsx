import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

const CATEGORY_COLORS = [
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#3b82f6', // Blue
    '#06b6d4', // Cyan
    '#14b8a6', // Teal
    '#6366f1', // Indigo
    '#10b981', // Green
    '#f97316', // Orange
];

const CATEGORY_ICONS = [
    '🍔', '🚗', '💡', '🏥', '🎮',
    '📚', '🛍️', '🏠', '💼', '💻',
    '📈', '🎁', '💰', '🏦', '📱',
    '✈️', '🎬', '🍽️', '⚽', '🎵',
];

export default function EditCategory() {
    const { category } = usePage().props as any;
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || '📁',
        color: category.color || '#64748b',
    });

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/categories/${category.id}`);
    };

    const handleDelete = () => {
        setDeleting(true);
        const router = require('@inertiajs/react').router;
        router.delete(`/categories/${category.id}`, {
            onSuccess: () => {
                setDeleting(false);
                setDeleteDialog(false);
            },
            onError: () => {
                setDeleting(false);
            },
        });
    };

    return (
        <AppLayout title="Editar Categoría">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <a
                        href="/categories"
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={24} className="text-slate-400" />
                    </a>
                    <h1 className="text-3xl font-bold text-white">Editar Categoría</h1>
                </div>

                {/* Form */}
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Ej: Alimentación"
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                            )}
                        </div>

                        {/* Type (Read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Tipo
                            </label>
                            <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400">
                                {category.type === 'income' ? 'Ingreso' : 'Gasto'}
                            </div>
                            <p className="mt-1 text-xs text-slate-500">El tipo no puede ser modificado</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Descripción de la categoría"
                                rows={3}
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                            )}
                        </div>

                        {/* Icon */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Icono
                            </label>
                            <div className="grid grid-cols-5 gap-2">
                                {CATEGORY_ICONS.map((icon) => (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => setData('icon', icon)}
                                        className={`p-3 rounded-lg text-2xl transition-colors ${
                                            data.icon === icon
                                                ? 'bg-indigo-600 border-2 border-indigo-400'
                                                : 'bg-slate-700 border-2 border-transparent hover:bg-slate-600'
                                        }`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                            {errors.icon && (
                                <p className="mt-1 text-sm text-red-400">{errors.icon}</p>
                            )}
                        </div>

                        {/* Color */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Color
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {CATEGORY_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setData('color', color)}
                                        className={`w-10 h-10 rounded-lg transition-transform ${
                                            data.color === color
                                                ? 'ring-2 ring-white scale-110'
                                                : 'hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                                <div className="flex items-center gap-2 ml-auto">
                                    <label className="text-slate-300">Color personalizado:</label>
                                    <input
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                    />
                                </div>
                            </div>
                            {errors.color && (
                                <p className="mt-1 text-sm text-red-400">{errors.color}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-slate-700">
                            <a
                                href="/categories"
                                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-center font-medium"
                            >
                                Cancelar
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setDeleteDialog(true)}
                                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors font-medium flex items-center gap-2"
                            >
                                <Trash2 size={18} />
                                Eliminar
                            </button>
                        </div>
                    </form>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialog}
                title="Eliminar Categoría"
                message={`¿Estás seguro de que deseas eliminar la categoría "${category.name}"?`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                isDanger={true}
                isLoading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteDialog(false)}
            />
        </AppLayout>
    );
}
