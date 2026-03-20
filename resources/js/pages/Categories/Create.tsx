import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import RadioButton from '@/components/RadioButton';
import { useForm } from '@inertiajs/react';
import { ArrowLeft, Utensils, Car, Lightbulb, HeartPulse, Gamepad2, BookOpen, ShoppingBag, Home, Folder, Briefcase, Laptop, TrendingUp, Gift, Coins, Coffee, Music, Plane, Tv, Users } from 'lucide-react';
import { FormEvent } from 'react';

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

export default function CreateCategory() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        icon: 'folder',
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

    const selectedIcon = ICON_OPTIONS.find(opt => opt.name === data.icon);
    const IconComponent = selectedIcon?.icon;

    return (
        <AppLayout title="Crear Categoría">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <a
                        href="/categories"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={24} className="text-gray-600 dark:text-slate-400" />
                    </a>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Crear Categoría</h1>
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
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="Ej: Alimentación"
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>
                            )}
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Tipo *
                            </label>
                            <div className="flex gap-4">
                                <RadioButton
                                    value="expense"
                                    checked={data.type === 'expense'}
                                    onChange={(e) => setData('type', e.target.value as 'income' | 'expense')}
                                    label="Gasto"
                                    color="red"
                                />
                                <RadioButton
                                    value="income"
                                    checked={data.type === 'income'}
                                    onChange={(e) => setData('type', e.target.value as 'income' | 'expense')}
                                    label="Ingreso"
                                    color="green"
                                />
                            </div>
                            {errors.type && (
                                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.type}</p>
                            )}
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
                        <div className="flex gap-3 pt-4">
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
                                {processing ? 'Creando...' : 'Crear Categoría'}
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
