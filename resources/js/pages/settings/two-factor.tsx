import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable } from '@/routes/two-factor';

type Props = {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <SettingsLayout>
            <Head title="Autenticación de dos factores" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Autenticación de dos factores
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-slate-400">
                        Gestiona tu configuración de autenticación de dos factores
                    </p>
                </div>

                {twoFactorEnabled ? (
                    <div className="space-y-6">
                        <div className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                            Habilitado
                        </div>
                        <p className="text-gray-700 dark:text-slate-300">
                            Con la autenticación de dos factores habilitada, se te pedirá un código seguro y aleatorio durante el inicio de sesión, que puedes obtener de una aplicación compatible con TOTP en tu teléfono.
                        </p>

                        <TwoFactorRecoveryCodes
                            recoveryCodesList={recoveryCodesList}
                            fetchRecoveryCodes={fetchRecoveryCodes}
                            errors={errors}
                        />

                        <div>
                            <Form {...disable.form()}>
                                {({ processing }) => (
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ShieldBan size={18} />
                                        Desactivar 2FA
                                    </button>
                                )}
                            </Form>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                            Deshabilitado
                        </div>
                        <p className="text-gray-700 dark:text-slate-300">
                            Cuando habilites la autenticación de dos factores, se te pedirá un código seguro durante el inicio de sesión. Este código se puede obtener de una aplicación compatible con TOTP en tu teléfono.
                        </p>

                        <div>
                            {hasSetupData ? (
                                <button
                                    onClick={() => setShowSetupModal(true)}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                                >
                                    <ShieldCheck size={18} />
                                    Continuar configuración
                                </button>
                            ) : (
                                <Form
                                    {...enable.form()}
                                    onSuccess={() =>
                                        setShowSetupModal(true)
                                    }
                                >
                                    {({ processing }) => (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ShieldCheck size={18} />
                                            Habilitar 2FA
                                        </button>
                                    )}
                                </Form>
                            )}
                        </div>
                    </div>
                )}

                <TwoFactorSetupModal
                    isOpen={showSetupModal}
                    onClose={() => setShowSetupModal(false)}
                    requiresConfirmation={requiresConfirmation}
                    twoFactorEnabled={twoFactorEnabled}
                    qrCodeSvg={qrCodeSvg}
                    manualSetupKey={manualSetupKey}
                    clearSetupData={clearSetupData}
                    fetchSetupData={fetchSetupData}
                    errors={errors}
                />
            </div>
        </SettingsLayout>
    );
}
