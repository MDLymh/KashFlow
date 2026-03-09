import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose?: () => void;
}

export default function Toast({ message, type, duration = 4000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const bgColor = {
        success: 'bg-green-500/20 border-green-500/30',
        error: 'bg-red-500/20 border-red-500/30',
        info: 'bg-blue-500/20 border-blue-500/30',
        warning: 'bg-yellow-500/20 border-yellow-500/30',
    }[type];

    const textColor = {
        success: 'text-green-400',
        error: 'text-red-400',
        info: 'text-blue-400',
        warning: 'text-yellow-400',
    }[type];

    const icon = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info,
        warning: AlertTriangle,
    }[type];

    const IconComponent = icon;

    return (
        <div
            className={`fixed bottom-6 right-6 max-w-sm rounded-lg border p-4 flex items-start gap-3 ${bgColor} ${textColor} animate-slideIn z-50`}
        >
            <IconComponent size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm flex-1">{message}</p>
            <button
                onClick={() => {
                    setIsVisible(false);
                    onClose?.();
                }}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
                <X size={16} />
            </button>
        </div>
    );
}
