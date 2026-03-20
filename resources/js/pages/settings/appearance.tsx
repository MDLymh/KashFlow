import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import SettingsLayout from '@/layouts/settings/layout';

export default function Appearance() {
    return (
        <SettingsLayout>
            <Head title="Configuración de apariencia" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Configuración de apariencia
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-slate-400">
                        Actualiza la configuración de apariencia de tu cuenta
                    </p>
                </div>
                <AppearanceTabs />
            </div>
        </SettingsLayout>
    );
}
