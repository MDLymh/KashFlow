interface ColorPickerProps {
    label?: string;
    value: string;
    onChange: (color: string) => void;
    error?: string;
    colors?: string[];
}

const ColorPicker = ({
    label,
    value,
    onChange,
    error,
    colors = [
        '#f59e0b', // Amber
        '#ef4444', // Red
        '#8b5cf6', // Purple
        '#ec4899', // Pink
        '#3b82f6', // Blue
        '#06b6d4', // Cyan
        '#14b8a6', // Teal
        '#6366f1', // Indigo
        '#10b981', // Green
        '#f97316', // Orange
    ],
}: ColorPickerProps) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    {label}
                </label>
            )}
            <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => onChange(color)}
                        className={`w-10 h-10 rounded-lg transition-transform ${
                            value === color
                                ? 'ring-2 ring-gray-400 dark:ring-white scale-110'
                                : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
};

export default ColorPicker;
