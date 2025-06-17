'use client';

import { useState } from 'react';
import { FiUserPlus, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function RegisterPage() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Password dan konfirmasi tidak sama');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('https://simaru.amisbudi.cloud/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: fullname,
                    email,
                    password,
                    password_confirmation: confirmPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registrasi gagal');
            }

            setSuccess('Registrasi berhasil! Silakan login.');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center pt-20 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Daftar akun baru
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Masuk di sini
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                                Nama Lengkap
                            </label>
                            <input
                                id="fullname"
                                type="text"
                                required
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Alamat Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                Konfirmasi Password
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                Saya menyetujui{' '}
                                <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
                                    Syarat dan Ketentuan
                                </Link>{' '}
                                serta{' '}
                                <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                                    Kebijakan Privasi
                                </Link>
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {loading ? 'Mendaftarkan...' : (
                                    <>
                                        <FiUserPlus className="mr-2 h-5 w-5" />
                                        Daftar
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Bagian alternatif daftar dengan Google/Microsoft, tetap sama */}
                    {/* ... */}
                    <div className="flex justify-center mt-10">
                        <Link href="/" className="flex items-center text-indigo-600 hover:text-indigo-500 mb-6">
                            <FiArrowLeft className="mr-2" />
                            Kembali ke beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
