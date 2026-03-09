<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Support\Collection;

class ReportExport implements FromCollection, WithHeadings
{
    public function __construct(private array $transactions)
    {
    }

    public function collection(): Collection
    {
        return collect($this->transactions)->map(fn($t) => [
            'Fecha' => $t['date'],
            'Título' => $t['title'],
            'Categoría' => $t['category'],
            'Tipo' => $t['type'] === 'income' ? 'Ingreso' : 'Gasto',
            'Monto' => $t['amount'],
        ]);
    }

    public function headings(): array
    {
        return ['Fecha', 'Título', 'Categoría', 'Tipo', 'Monto'];
    }
}
