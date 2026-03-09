import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, BarChart3, Wallet, FileText, Receipt, Tag, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
    headerAction?: ReactNode;
}

export default function AppLayout({ children, title, headerAction }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { label: 'Dashboard', href: '/dashboard', Icon: BarChart3 },
        { label: 'Transacciones', href: '/transactions', Icon: Wallet },
        { label: 'Reportes', href: '/reports', Icon: FileText },
        { label: 'Recibos', href: '/receipts', Icon: Receipt },
        { label: 'Categorías', href: '/categories', Icon: Tag },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 transform transition-transform duration-200 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="p-6 border-b border-slate-700">
                        <h1 className="text-2xl font-bold text-indigo-400 flex items-center gap-2">
                            <Wallet size={24} />
                            KashFlow
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">Control de gastos e ingresos</p>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                        {menuItems.map((item) => {
                            const IconComponent = item.Icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors duration-200"
                                >
                                    <IconComponent size={20} className="mr-3" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-700">
                        <Link
                            href="/settings/profile"
                            className="text-sm text-slate-400 hover:text-slate-300 block mb-3 flex items-center gap-2"
                        >
                            <Settings size={16} />
                            Configuración
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2"
                        >
                            <LogOut size={16} />
                            Cerrar sesión
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64">
                {/* Top bar */}
                <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
                    <div className="flex items-center justify-between px-4 md:px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden p-2 hover:bg-slate-800 rounded-lg"
                        >
                            <Menu size={24} className="text-slate-400" />
                        </button>
                        {title && (
                            <h2 className="text-xl font-semibold text-white">{title}</h2>
                        )}
                        <div className="flex-1" />
                        {headerAction && (
                            <div>{headerAction}</div>
                        )}
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4 md:p-6 min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
