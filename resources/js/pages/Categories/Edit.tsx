import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import RadioButton from '@/components/RadioButton';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Trash2, Utensils, Car, Lightbulb, HeartPulse, Gamepad2, BookOpen, ShoppingBag, Home, Folder, Briefcase, Laptop, TrendingUp, Gift, Coins, Coffee, Music, Plane, Tv, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';

const ICON_OPTIONS = [
    { name: 'utensils', icon: Utensils, label: 'Comida' },
    { name: 'car', icon: Car, label: 'Auto' },
    { name: 'lightbulb', icon: Lightbulb, label: 'Luz' },
    { name: 'heart-pulse', icon: HeartPulse, label: 'Salud' },
    { name: 'gamepad2', icon: Gamepad2, label: 'Juego' },
    { name: 'book-open', icon: BookOpen, label: 'Educación' },
    { name: 'shopping-bag', icon: ShoppingBag, label: 'Compras' },
    { name: 'home', icon: Home, label: 'Casa' },
    { name: 'folder', icon: Folder, label: 'Carpeta' },
    { name: 'briefcase', icon: Briefcase, label: 'Trabajo' },
    { name: 'laptop', icon: Laptop, label: 'Laptop' },
    { name: 'trending-up', icon: TrendingUp, label: 'Inversión' },
    { name: 'gift', icon: Gift, label: 'Regalo' },
    { name: 'coins', icon: Coins, label: 'Dinero' },
    { name: 'coffee', icon: Coffee, label: 'Café' },
    { name: 'music', icon: Music, label: 'Música' },
    { name: 'plane', icon: Plane, label: 'Viaje' },
    { name: 'tv', icon: Tv, label: 'Entretenimiento' },
    { name: 'users', icon: Users, label: 'Grupo' },
];

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

export default function EditCategory() {
    const { category } = usePage().props as any;
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || 'folder',
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

    const selectedIcon = ICON_OPTIONS.find(opt => opt.name === data.icon);
    const IconComponent = selectedIcon?.icon;

    return (
        <AppLayout title="Editar Categoría">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <a
                        href="/categories"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={24} className="text-gray-600 dark:text-slate-400" />
                    </a>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Editar Categoría</h1>
                </div>

                {/* Form */}
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Ej: Alimentación"
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>
                            )}
                        </div>

                        {/* Type (Read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Tipo
                            </label>
                            <div className="px-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-600 dark:text-slate-400">
                                {category.type === 'income' ? 'Ingreso' : 'Gasto'}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">El tipo no puede ser modificado</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Descripción de la categoría"
                                rows={3}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors resize-none"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.description}</p>
                            )}
                        </div>

                        {/* Icon */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Icono
                            </label>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-600/20 rounded-lg">
                                    {IconComponent && <IconComponent size={28} className="text-indigo-600 dark:text-indigo-400" />}
                                </div>
                                <span className="text-gray-700 dark:text-slate-300">{selectedIcon?.label || 'Seleccionar icono'}</span>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {ICON_OPTIONS.map((opt) => {
                                    const Icon = opt.icon;
                                    return (
                                        <button
                                            key={opt.name}
                                            type="button"
                                            onClick={() => setData('icon', opt.name)}
                                            className={`p-3 rounded-lg transition-colors flex flex-col items-center gap-1 ${
                                                data.icon === opt.name
                                                    ? 'bg-indigo-600 border-2 border-indigo-400 text-white'
                                                    : 'bg-gray-200 dark:bg-slate-700 border-2 border-transparent hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-slate-300'
                                            }`}
                                            title={opt.label}
                                        >
                                            <Icon size={20} />
                                            <span className="text-xs">{opt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.icon && (
                                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.icon}</p>
                            )}
                        </div>

                        {/* Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
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
                                                ? 'ring-2 ring-gray-400 dark:ring-white scale-110'
                                                : 'hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                                <div className="flex items-center gap-2 ml-auto">
                                    <label className="text-gray-700 dark:text-slate-300">Color personalizado:</label>
                                    <input
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                    />
                                </div>
                            </div>
                            {errors.color && (
                                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.color}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                            <a
                                href="/categories"
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg transition-colors text-center font-medium"
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
                                className="px-4 py-2 bg-red-100 dark:bg-red-600/20 hover:bg-red-200 dark:hover:bg-red-600/30 text-red-600 dark:text-red-400 rounded-lg transition-colors font-medium flex items-center gap-2"
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
