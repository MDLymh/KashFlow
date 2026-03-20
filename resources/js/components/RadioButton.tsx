interface RadioButtonProps {
    value: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    color?: 'green' | 'red' | 'default';
}

export default function RadioButton({
    value,
    checked,
    onChange,
    label,
    color = 'default',
}: RadioButtonProps) {
    const colorClasses = {
        green: 'text-green-600 dark:text-green-400',
        red: 'text-red-600 dark:text-red-400',
        default: 'text-gray-700 dark:text-slate-300',
    };

    return (
        <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
                <input
                    type="radio"
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    className="appearance-none w-5 h-5 border-2 border-gray-300 dark:border-slate-500 rounded-full cursor-pointer transition-all
                        checked:border-indigo-600 dark:checked:border-indigo-500
                        checked:bg-indigo-600 dark:checked:bg-indigo-500
                        hover:border-gray-400 dark:hover:border-slate-400
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800"
                />
                {checked && (
                    <svg
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <circle cx="10" cy="10" r="3" />
                    </svg>
                )}
            </div>
            <span className={`${colorClasses[color]} font-medium`}>{label}</span>
        </label>
    );
}
