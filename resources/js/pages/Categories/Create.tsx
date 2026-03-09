import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import { useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

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

export default function CreateCategory() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        icon: '📁',
        type: 'expense' as 'income' | 'expense',
        color: '#64748b',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/categories');
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (value: string) => {
        setData('name', value);
        setData('slug', generateSlug(value));
    };

    return (
        <AppLayout title="Crear Categoría">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <a
                        href="/categories"
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={24} className="text-slate-400" />
                    </a>
                    <h1 className="text-3xl font-bold text-white">Crear Categoría</h1>
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
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="Ej: Alimentación"
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                            )}
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Tipo *
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="expense"
                                        checked={data.type === 'expense'}
                                        onChange={(e) => setData('type', e.target.value as 'income' | 'expense')}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-slate-300">Gasto</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="income"
                                        checked={data.type === 'income'}
                                        onChange={(e) => setData('type', e.target.value as 'income' | 'expense')}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-slate-300">Ingreso</span>
                                </label>
                            </div>
                            {errors.type && (
                                <p className="mt-1 text-sm text-red-400">{errors.type}</p>
                            )}
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
                        <div className="flex gap-3 pt-4">
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
                                {processing ? 'Creando...' : 'Crear Categoría'}
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
