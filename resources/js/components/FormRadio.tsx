interface FormRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    options: Array<{ value: string | number; label: string }>;
}

const FormRadio = ({ label, error, options, className, ...props }: FormRadioProps) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    {label}
                </label>
            )}
            <div className="flex gap-4">
                {options.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                            {...props}
                            type="radio"
                            value={opt.value}
                            className="w-4 h-4 accent-indigo-600 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 dark:text-slate-300">{opt.label}</span>
                    </label>
                ))}
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
};

export default FormRadio;
