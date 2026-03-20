import { ReactNode } from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: ReactNode;
}

const FormTextarea = ({ label, error, helperText, icon, className, rows = 3, ...props }: FormTextareaProps) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-3 text-gray-600 dark:text-slate-400">
                        {icon}
                    </div>
                )}
                <textarea
                    {...props}
                    rows={rows}
                    className={`w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors resize-none ${
                        icon ? 'pl-10' : ''
                    } ${error ? 'border-red-500 dark:border-red-400' : ''} ${className || ''}`}
                />
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            {helperText && <p className="text-xs text-gray-600 dark:text-slate-400">{helperText}</p>}
        </div>
    );
};

export default FormTextarea;
