import { Form, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/Card';
import { Lock } from 'lucide-react';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <AppLayout>
            <Head title="Confirmar contraseña" />
            <Card title="Confirmar contraseña" subtitle="Esta es un área segura. Por favor confirma tu contraseña para continuar.">
                <Form {...store.form()} resetOnSuccess={['password']}>
                    {({ processing, errors }) => (
                        <div className="max-w-md space-y-6">
                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    <Lock size={16} className="inline-block mr-2" />
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    autoComplete="current-password"
                                    autoFocus
                                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.password}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processing && (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                )}
                                {processing ? 'Confirmando...' : 'Confirmar contraseña'}
                            </button>
                        </div>
                    )}
                </Form>
            </Card>
        </AppLayout>
    );
}
