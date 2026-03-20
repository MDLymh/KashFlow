import React from 'react';
import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Plus, Trash2, Edit, AlertCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getIconComponent } from '@/lib/iconUtils';
import { useState } from 'react';

interface Category {
  id: number;
  name: string;
  icon: string;
  description?: string;
  created_at: string;
  is_base: boolean;
}

interface Props {
  categories: Category[];
}

export default function Index({ categories }: Props) {
  const { auth } = usePage().props;
  const [deleteDialog, setDeleteDialog] = useState<{ show: boolean; categoryId: number | null; categoryName: string } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' } | null>(null);

  const handleDeleteClick = (categoryId: number, categoryName: string) => {
    setDeleteDialog({
      show: true,
      categoryId,
      categoryName,
    });
  };

  const confirmDelete = () => {
    if (!deleteDialog?.categoryId) return;
    
    const categoryId = deleteDialog.categoryId;
    setDeleting(categoryId);
    setDeleteDialog(null);

    router.delete(`/categories/${categoryId}`, {
      onSuccess: () => {
        setDeleting(null);
        setToast({
          show: true,
          message: 'Categoría eliminada exitosamente',
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
          message: 'Error al eliminar la categoría',
          type: 'error',
        });
      },
    });
  };

  // Renderiza un icono lucide dinámicamente
  const renderIcon = (iconName: string) => {
    const IconComponent = getIconComponent(iconName);
    if (IconComponent) {
      return React.createElement(IconComponent, { size: 32, className: 'text-indigo-600' });
    }
    // Fallback si el icono no existe
    return React.createElement(LucideIcons.FolderOpen, { size: 32, className: 'text-gray-400' });
  };

  return (
    <AppLayout>
      <Head title="Categorías" />
      <Card>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Categorías</h1>
            <p className="mt-2 text-gray-400">Gestiona tus categorías de gastos e ingresos</p>
          </div>
          <Link
            href="/categories/create"
          >
            <Button type="button" className="flex items-center gap-2">
              <Plus size={20} />
              Nueva Categoría
            </Button>
          </Link>
        </div>

        {/* Categories Grid */}
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-lg hover:shadow-md dark:hover:shadow-lg transition-all p-6 border border-gray-200 dark:border-gray-700"
              >
                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                    {renderIcon(category.icon)}
                  </div>
                  {!category.is_base && (
                    <div className="flex gap-2">
                      <Link
                        href={`/categories/${category.id}/edit`}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(category.id, category.name)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                  {category.is_base && (
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                      Base
                    </span>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Creada el {new Date(category.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="inline-block p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              {React.createElement(LucideIcons.FolderOpen, { size: 32, className: 'text-gray-500 dark:text-gray-500' })}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No tienes categorías</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Comienza creando tu primera categoría</p>
            <Link href="/categories/create">
              <Button type="button" className="inline-flex items-center gap-2">
                <Plus size={20} />
                Crear Categoría
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteDialog?.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-sm border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Confirmar eliminación</h3>
            </div>
            <p className="text-slate-400 mb-6">¿Estás seguro de que deseas eliminar la categoría "{deleteDialog.categoryName}"? Esta acción no se puede deshacer.</p>
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
