"use client";
import { FiLogIn, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!email || !password) {
            setError('Email dan password harus diisi');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('https://simaru.amisbudi.cloud/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login gagal');
            }

            // Simpan data ke localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('token', data.token);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('userData', JSON.stringify({
                name: data.user?.name || 'User',
                avatar: data.user?.avatar || '/profile.png'
            }));

            // Refresh halaman untuk memastikan navbar terupdate
            window.location.href = '/dashboard';

        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat login');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Link href="/" className="flex items-center text-indigo-600 hover:text-indigo-500 mb-6">
                        <FiArrowLeft className="mr-2" />
                        Kembali ke beranda
                    </Link>
                </div>

                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Masuk ke akun Anda
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Atau{' '}
                    <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        daftar akun baru
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Alamat Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Ingat saya
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Lupa password?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit" disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <FiLogIn className="mr-2 h-5 w-5" />
                                {isLoading ? 'Memproses...' : 'Login'}
                            </button>
                        </div>
                    </form>

                    {/* ... (kode social login tetap sama) ... */}
                </div>
            </div>
        </div>
    );
}