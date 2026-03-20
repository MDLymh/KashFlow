import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/user-password';

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <SettingsLayout>
            <Head title="Configuración de contraseña" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Actualizar contraseña
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-slate-400">
                        Asegúrate de que tu cuenta esté usando una contraseña larga y aleatoria para mantener la seguridad
                    </p>
                </div>

                <Form
                    {...PasswordController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    resetOnError={[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                    className="space-y-6"
                >
                    {({ errors, processing, recentlySuccessful }) => (
                        <>
                            <div className="space-y-2">
                                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Contraseña actual
                                </label>

                                <PasswordInput
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    name="current_password"
                                    className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
                                    autoComplete="current-password"
                                    placeholder="Contraseña actual"
                                />

                                <InputError
                                    message={errors.current_password}
                                />
                                </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Nueva contraseña
                                </label>

                                <PasswordInput
                                    id="password"
                                    ref={passwordInput}
                                    name="password"
                                    className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
                                    autoComplete="new-password"
                                    placeholder="Nueva contraseña"
                                />

                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Confirmar contraseña
                                </label>

                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
                                    autoComplete="new-password"
                                    placeholder="Confirmar contraseña"
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-test="update-password-button"
                                >
                                    Guardar contraseña
                                </button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-green-600 dark:text-green-400">
                                        Guardado
                                    </p>
                                </Transition>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </SettingsLayout>
    );
}
