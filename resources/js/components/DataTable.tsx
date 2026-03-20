import { ReactNode } from 'react';

interface DataTableColumn<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (value: any, row: T) => ReactNode;
    align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    keyField: keyof T;
    emptyMessage?: string;
    onRowClick?: (row: T) => void;
    hoverable?: boolean;
}

export default function DataTable<T extends Record<string, any>>({
    columns,
    data,
    keyField,
    emptyMessage = 'No hay datos para mostrar',
    onRowClick,
    hoverable = true,
}: DataTableProps<T>) {
    const alignmentClass = (align?: string) => {
        switch (align) {
            case 'center':
                return 'text-center';
            case 'right':
                return 'text-right';
            default:
                return 'text-left';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700">
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                className={`py-3 px-4 font-semibold text-gray-700 dark:text-slate-300 ${alignmentClass(col.align)}`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row) => (
                            <tr
                                key={String(row[keyField])}
                                onClick={() => onRowClick?.(row)}
                                className={`border-b border-gray-200 dark:border-slate-700 ${
                                    hoverable ? 'hover:bg-gray-100 dark:hover:bg-slate-700/30 transition-colors' : ''
                                } ${onRowClick ? 'cursor-pointer' : ''}`}
                            >
                                {columns.map((col) => (
                                    <td
                                        key={String(col.key)}
                                        className={`py-3 px-4 text-gray-900 dark:text-white ${alignmentClass(col.align)}`}
                                    >
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="py-8 px-4 text-center text-gray-600 dark:text-slate-400">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
