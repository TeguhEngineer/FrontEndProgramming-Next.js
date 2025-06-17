'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Calendar, UserCheck, Clock, DollarSign } from 'lucide-react';
import { useState } from 'react';

export default function DashboardBooking() {
    const dataPemesanan = [
        { name: 'Jan', pemesanan: 45 },
        { name: 'Feb', pemesanan: 60 },
        { name: 'Mar', pemesanan: 75 },
        { name: 'Apr', pemesanan: 90 },
        { name: 'May', pemesanan: 110 },
        { name: 'Jun', pemesanan: 130 },
    ];

    const totalPemesanan = dataPemesanan.reduce((sum, item) => sum + item.pemesanan, 0);

    return (
        <div className="min-h-screen bg-gray-100 p-6 pt-24">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dasbor Pemesanan</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="p-6 bg-white shadow-lg rounded-lg flex items-center gap-4">
                    <Calendar className="text-blue-500" size={32} />
                    <div>
                        <p className="text-gray-600 font-bold">Total Pemesanan</p>
                        <p className="text-2xl font-bold text-gray-600">{totalPemesanan}</p>
                    </div>
                </div>
                <div className="p-6 bg-white shadow-lg rounded-lg flex items-center gap-4">
                    <UserCheck className="text-green-500" size={32} />
                    <div>
                        <p className="text-gray-600 font-bold">Pemesanan Aktif</p>
                        <p className="text-2xl font-bold text-gray-600">25</p>
                    </div>
                </div>
                <div className="p-6 bg-white shadow-lg rounded-lg flex items-center gap-4">
                    <Clock className="text-yellow-500" size={32} />
                    <div>
                        <p className="text-gray-600 font-bold">Pemesanan Tertunda</p>
                        <p className="text-2xl font-bold text-gray-600">15</p>
                    </div>
                </div>
                <div className="p-6 bg-white shadow-lg rounded-lg flex items-center gap-4">
                    <DollarSign className="text-red-500" size={32} />
                    <div>
                        <p className="text-gray-600 font-bold">Pendapatan Bulan Ini</p>
                        <p className="text-2xl font-bold text-gray-600">Rp 45.000.000</p>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Tren Pemesanan Bulanan</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dataPemesanan}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="pemesanan" fill="#FF9D23" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}