import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Password',
        href: editPassword(),
        icon: null,
    },
    {
        title: 'Two-factor auth',
        href: show(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <AppLayout>
            <Card title="Configuración" subtitle="Gestiona tu perfil y preferencias de cuenta">
                <div className="flex flex-col lg:flex-row lg:gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full lg:w-48 mb-6 lg:mb-0">
                        <nav className="flex flex-col space-y-2" aria-label="Settings">
                            {sidebarNavItems.map((item, index) => (
                                <Link
                                    key={`${toUrl(item.href)}-${index}`}
                                    href={item.href}
                                    className={cn(
                                        'px-4 py-2 rounded-lg transition-colors text-sm font-medium',
                                        isCurrentOrParentUrl(item.href)
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                                    )}
                                >
                                    {item.icon && (
                                        <item.icon className="h-4 w-4 inline-block mr-2" />
                                    )}
                                    {item.title}
                                </Link>
                            ))}
                        </nav>
                    </aside>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="space-y-8">
                            {children}
                        </div>
                    </div>
                </div>
            </Card>
        </AppLayout>
    );
}
