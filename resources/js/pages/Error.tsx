import { Head } from '@inertiajs/react';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface ErrorProps {
    status: number;
    message?: string;
}

const statusMessages: { [key: number]: { title: string; description: string } } = {
    403: {
        title: 'Acceso Denegado',
        description: 'No tienes permiso para acceder a este recurso.',
    },
    404: {
        title: 'No Encontrado',
        description: 'La página que buscas no existe.',
    },
    500: {
        title: 'Error del Servidor',
        description: 'Algo salió mal en el servidor. Por favor intenta más tarde.',
    },
    503: {
        title: 'Servicio No Disponible',
        description: 'El servidor está actualmente no disponible. Por favor intenta más tarde.',
    },
};

export default function Error({ status, message }: ErrorProps) {
    const errorInfo = statusMessages[status] || {
        title: `Error ${status}`,
        description: message || 'Ocurrió un error desconocido.',
    };

    return (
        <>
            <Head title={`${status} - Error`} />
            <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <ShieldAlert size={48} className="text-red-600 dark:text-red-400" />
                        </div>
                    </div>

                    {/* Error Code */}
                    <div className="mb-4">
                        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-2">{status}</h1>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{errorInfo.title}</h2>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-8">{errorInfo.description}</p>

                    {/* Actions */}
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
                        >
                            <Home size={18} />
                            Ir al Dashboard
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg transition-colors font-medium"
                        >
                            <ArrowLeft size={18} />
                            Volver Atrás
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
