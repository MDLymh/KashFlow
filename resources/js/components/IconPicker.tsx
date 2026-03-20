import { ReactNode } from 'react';

interface IconOption {
    name: string;
    icon: any;
    label: string;
}

interface IconPickerProps {
    label?: string;
    value: string;
    onChange: (icon: string) => void;
    error?: string;
    options: IconOption[];
    previewColor?: string;
}

const IconPicker = ({
    label,
    value,
    onChange,
    error,
    options,
    previewColor = '#4f46e5',
}: IconPickerProps) => {
    const selectedIcon = options.find((opt) => opt.name === value);
    const IconComponent = selectedIcon?.icon;

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    {label}
                </label>
            )}

            {/* Preview */}
            {selectedIcon && (
                <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: previewColor + '20' }}>
                        {IconComponent && <IconComponent size={28} style={{ color: previewColor }} />}
                    </div>
                    <span className="text-gray-700 dark:text-slate-300">{selectedIcon.label}</span>
                </div>
            )}

            {/* Icon Grid */}
            <div className="grid grid-cols-5 gap-2">
                {options.map((opt) => {
                    const Icon = opt.icon;
                    return (
                        <button
                            key={opt.name}
                            type="button"
                            onClick={() => onChange(opt.name)}
                            className={`p-3 rounded-lg transition-colors flex flex-col items-center gap-1 ${
                                value === opt.name
                                    ? 'border-2 border-indigo-400 text-white'
                                    : 'bg-gray-200 dark:bg-slate-700 border-2 border-transparent hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-slate-300'
                            }`}
                            style={{
                                backgroundColor: value === opt.name ? previewColor : undefined,
                            }}
                            title={opt.label}
                        >
                            <Icon size={20} />
                            <span className="text-xs text-center">{opt.label}</span>
                        </button>
                    );
                })}
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
};

export default IconPicker;
