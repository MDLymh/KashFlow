import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    return (
        <SettingsLayout>
            <Head title="Configuración de perfil" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Información de perfil
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-slate-400">
                        Actualiza tu nombre y correo electrónico
                    </p>
                </div>

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, recentlySuccessful, errors }) => (
                        <>
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Nombre
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Nombre completo"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Correo electrónico
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Correo electrónico"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600 dark:text-slate-400">
                                            Tu correo electrónico no está verificado.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                                            >
                                                Haz clic aquí para reenviar el correo de verificación.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="text-sm font-medium text-green-600 dark:text-green-400">
                                                Se ha enviado un nuevo enlace de verificación a tu correo electrónico.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-test="update-profile-button"
                                >
                                    Guardar
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

            <DeleteUser />
        </SettingsLayout>
    );
}
