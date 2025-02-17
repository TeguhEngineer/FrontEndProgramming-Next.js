'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';

export default function Home() {
  const data = [
    { name: 'Jan', omzet: 500000 },
    { name: 'Feb', omzet: 650000 },
    { name: 'Mar', omzet: 720000 },
    { name: 'Apr', omzet: 800000 },
    { name: 'May', omzet: 900000 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 mt-20 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="p-6 bg-white shadow-lg rounded-lg flex items-center gap-4">
          <Package className="text-blue-500" size={32} />
          <div>
            <p className="text-gray-600 font-bold">Total Produk</p>
            <p className="text-2xl font-bold text-gray-600">50</p>
          </div>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg flex items-center gap-4">
          <Users className="text-green-500" size={32} />
          <div>
            <p className="text-gray-600 font-bold">Total Mitra</p>
            <p className="text-2xl font-bold text-gray-600">10</p>
          </div>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg flex items-center gap-4">
          <ShoppingCart className="text-yellow-500" size={32} />
          <div>
            <p className="text-gray-600 font-bold">Produk Konsinyasi</p>
            <p className="text-2xl font-bold text-gray-600">20</p>
          </div>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg flex items-center gap-4">
          <DollarSign className="text-red-500" size={32} />
          <div>
            <p className="text-gray-600 font-bold">Omzet Hari Ini</p>
            <p className="text-2xl font-bold text-gray-600">Rp 650.000</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Chart Penjualan Bulanan</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="omzet" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}