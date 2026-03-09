import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface AlertProps {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose?: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
    const styles = {
        success: {
            bg: 'bg-green-50',
            text: 'text-green-800',
            icon: 'text-green-400',
            border: 'border-green-200',
        },
        error: {
            bg: 'bg-red-50',
            text: 'text-red-800',
            icon: 'text-red-400',
            border: 'border-red-200',
        },
        warning: {
            bg: 'bg-yellow-50',
            text: 'text-yellow-800',
            icon: 'text-yellow-400',
            border: 'border-yellow-200',
        },
        info: {
            bg: 'bg-blue-50',
            text: 'text-blue-800',
            icon: 'text-blue-400',
            border: 'border-blue-200',
        },
    };

    const style = styles[type];
    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info,
    };

    const Icon = icons[type];

    return (
        <div className={`${style.bg} border ${style.border} rounded-lg p-4 flex items-start gap-3`}>
            <Icon className={`${style.icon} flex-shrink-0 mt-0.5`} size={20} />
            <div className="flex-1">
                <p className={`${style.text} font-medium`}>{message}</p>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className={`${style.text} hover:opacity-75 text-xl leading-none`}
                >
                    ×
                </button>
            )}
        </div>
    );
}
