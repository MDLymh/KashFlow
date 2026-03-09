import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, FolderOpen, Trash2 } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    type: 'income' | 'expense';
    color: string;
    transactionCount: number;
    isOtros: boolean;
}

export default function CategoriesList() {
    const { categories, filterType } = usePage().props as any;
    const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>(filterType || 'all');
    const [deleteDialog, setDeleteDialog] = useState<{categoryId: number, categoryName: string, hasTransactions: boolean} | null>(null);
    const [deleting, setDeleting] = useState<number | null>(null);

    const filtered = selectedType === 'all'
        ? categories
        : categories.filter((c: Category) => c.type === selectedType);

    const incomeCategories = categories.filter((c: Category) => c.type === 'income');
    const expenseCategories = categories.filter((c: Category) => c.type === 'expense');

    const handleDelete = (category: Category) => {
        setDeleteDialog({
            categoryId: category.id,
            categoryName: category.name,
            hasTransactions: category.transactionCount > 0,
        });
    };

    const confirmDelete = () => {
        if (!deleteDialog) return;
        
        setDeleting(deleteDialog.categoryId);
        router.delete(`/categories/${deleteDialog.categoryId}`, {
            onSuccess: () => {
                setDeleting(null);
                setDeleteDialog(null);
                // Reload page to reflect changes
                window.location.reload();
            },
            onError: (errors) => {
                setDeleting(null);
                console.error('Error deleting category:', errors);
            },
        });
    };

    return (
        <AppLayout title="Categorías">
            <div className="space-y-6">
                {/* Filter Controls */}
                <Card>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelectedType('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    selectedType === 'all'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                            >
                                Todas
                            </button>
                            <button
                                onClick={() => setSelectedType('income')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    selectedType === 'income'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                            >
                                Ingresos ({incomeCategories.length})
                            </button>
                            <button
                                onClick={() => setSelectedType('expense')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    selectedType === 'expense'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                            >
                                Gastos ({expenseCategories.length})
                            </button>
                        </div>
                        <Link
                            href="/categories/create"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Nueva
                        </Link>
                    </div>
                </Card>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((category: Category) => (
                        <Card key={category.id} className="flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-4xl">{category.icon}</div>
                                <span className={`px-3 py-1 rounded text-xs font-medium ${
                                    category.type === 'income'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400'
                                }`}>
                                    {category.type === 'income' ? 'Ingreso' : 'Gasto'}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-2">{category.name}</h3>
                            
                            {category.description && (
                                <p className="text-sm text-slate-400 mb-4 flex-1">{category.description}</p>
                            )}

                            <div className="pt-4 border-t border-slate-700">
                                <p className="text-xs text-slate-400 mb-3">
                                    {category.transactionCount} transacciones
                                </p>
                                <div
                                    className="h-2 rounded-full mb-4"
                                    style={{ backgroundColor: category.color }}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href={`/categories/${category.id}/edit`}
                                    className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors text-center"
                                >
                                    Editar
                                </Link>
                                <button
                                    onClick={() => handleDelete(category)}
                                    disabled={category.isOtros || deleting === category.id}
                                    className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    {deleting === category.id ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <Card className="text-center py-12">
                        <FolderOpen size={48} className="mx-auto text-slate-400 mb-4" />
                        <p className="text-slate-400">No hay categorías</p>
                    </Card>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialog !== null && !deleteDialog?.categoryName?.toLowerCase().includes('otros')}
                title="Eliminar Categoría"
                message={
                    deleteDialog?.hasTransactions
                        ? `¿Estás seguro de que deseas eliminar la categoría "${deleteDialog?.categoryName}"? Sus transacciones se moverán automáticamente a "Otros".`
                        : `¿Estás seguro de que deseas eliminar la categoría "${deleteDialog?.categoryName}"?`
                }
                confirmText="Eliminar"
                cancelText="Cancelar"
                isDanger={true}
                isLoading={deleting !== null}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialog(null)}
            />
        </AppLayout>
    );
}
