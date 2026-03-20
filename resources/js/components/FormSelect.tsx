import { ReactNode } from 'react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options: Array<{ value: string | number; label: string }>;
}

const FormSelect = ({ label, error, helperText, options, className, ...props }: FormSelectProps) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    {label}
                </label>
            )}
            <select
                {...props}
                className={`w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors ${
                    error ? 'border-red-500 dark:border-red-400' : ''
                } ${className || ''}`}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            {helperText && <p className="text-xs text-gray-600 dark:text-slate-400">{helperText}</p>}
        </div>
    );
};

export default FormSelect;
