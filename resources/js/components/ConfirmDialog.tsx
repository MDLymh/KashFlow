import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    isDanger = false,
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-slate-800 rounded-lg shadow-2xl max-w-md w-full border border-slate-700">
                    {/* Header */}
                    <div className={`flex items-start gap-4 p-6 border-b border-slate-700 ${
                        isDanger ? 'bg-red-950/30' : 'bg-slate-750'
                    }`}>
                        <div className={`p-2 rounded-lg ${isDanger ? 'bg-red-500/20' : 'bg-indigo-500/20'}`}>
                            {isDanger ? (
                                <Trash2 className="text-red-400" size={24} />
                            ) : (
                                <AlertTriangle className="text-yellow-400" size={24} />
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-white">{title}</h2>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <p className="text-slate-300">{message}</p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700 bg-slate-900/50">
                        <button
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                isDanger
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Eliminando...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={16} />
                                    {confirmText}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
