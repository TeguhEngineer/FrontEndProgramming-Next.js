"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
    status?: string;
}

export default function UserTable() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const itemsPerPage = 5;

    // Modal add user
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState<User>({
        id: 0,
        name: '',
        email: '',
        role: 'User',
        status: 'Active'
    });

    const roleOptions = ['Admin', 'User', 'Manager', 'Editor'];
    const statusOptions = ['Active', 'Inactive'];

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddUser = () => {
        // Basic validation
        if (!newUser.name || !newUser.email) {
            alert("Harap lengkapi nama dan email!");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newUser.email)) {
            alert("Format email tidak valid!");
            return;
        }

        setUsers(prevUsers => [
            ...prevUsers,
            { ...newUser, id: prevUsers.length + 1 }
        ]);

        // Reset form and close modal
        setNewUser({
            id: 0,
            name: '',
            email: '',
            role: 'User',
            status: 'Active'
        });
        closeModal();
    };

    // Fetch initial data
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/users.json');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
                // Optional: set some initial mock data
                setUsers([
                    { id: 1, name: "John Doe", email: "john@example.com", role: "User", status: "Active" },
                    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" }
                ]);
            }
        };

        fetchUsers();
    }, []);

    // Filtering users
    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.status && user.status.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm]);

    // Pagination
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUsers, currentPage]);

    // Delete single user
    const handleDeleteUser = (id: number) => {
        const updatedUsers = users.filter(user => user.id !== id);
        setUsers(updatedUsers);

        // Reset page if last user on page is deleted
        if (paginatedUsers.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Delete selected users
    const handleDeleteSelectedUsers = () => {
        const updatedUsers = users.filter(
            user => !selectedUsers.includes(user.id)
        );
        setUsers(updatedUsers);
        setSelectedUsers([]);

        // Reset page if all users on page are deleted
        if (paginatedUsers.length <= selectedUsers.length && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Toggle user selection
    const handleSelectUser = (id: number) => {
        setSelectedUsers(prev =>
            prev.includes(id)
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
        );
    };

    // Toggle selection of all users on current page
    const handleSelectAllOnPage = () => {
        const pageUserIds = paginatedUsers.map(user => user.id);
        const allSelected = pageUserIds.every(id => selectedUsers.includes(id));

        if (allSelected) {
            // If all are selected, remove all from selection
            setSelectedUsers(prev =>
                prev.filter(selectedId => !pageUserIds.includes(selectedId))
            );
        } else {
            // Add IDs of users not yet selected
            setSelectedUsers(prev => [
                ...prev.filter(selectedId => !pageUserIds.includes(selectedId)),
                ...pageUserIds.filter(id => !prev.includes(id))
            ]);
        }
    };

    // Calculate total pages
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="container mx-auto max-w-6xl mt-16">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    {/* Add User Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
                            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-2/3 lg:w-1/2" onClick={(e) => e.stopPropagation()}>
                                <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Tambah Pengguna</h2>

                                {/* Name */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newUser.name}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md text-gray-700"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newUser.email}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md text-gray-700"
                                        placeholder="Masukkan alamat email"
                                    />
                                </div>

                                {/* Role */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Peran</label>
                                    <select
                                        name="role"
                                        value={newUser.role}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md text-gray-700"
                                    >
                                        {roleOptions.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        name="status"
                                        value={newUser.status}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md text-gray-700"
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-400 rounded-lg text-white"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleAddUser}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                                    >
                                        Tambah
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <div className="bg-blue-50 p-4 md:p-6 border-b border-gray-200 flex w-full">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Master Pengguna</h1>

                        <button
                            onClick={openModal}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ms-auto"
                        >
                            + Tambah Pengguna
                        </button>
                    </div>

                    {/* Search and Delete Controls */}
                    <div className="p-4 md:p-6 bg-white">
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Cari pengguna..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                            {selectedUsers.length > 0 && (
                                <button
                                    onClick={handleDeleteSelectedUsers}
                                    className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 gap-2"
                                >
                                    <Trash2 size={18} />
                                    Hapus Terpilih ({selectedUsers.length})
                                </button>
                            )}
                        </div>

                        {/* User Table */}
                        <div className="w-full overflow-x-auto">
                            <table className="w-full min-w-max border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 text-left w-12">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                                checked={paginatedUsers.length > 0 &&
                                                    paginatedUsers.every(user => selectedUsers.includes(user.id))}
                                                onChange={handleSelectAllOnPage}
                                            />
                                        </th>
                                        <th className="p-3 text-left text-gray-800">No.</th>
                                        <th className="p-3 text-left text-gray-800">Nama</th>
                                        <th className="p-3 text-left text-gray-800">Email</th>
                                        <th className="p-3 text-left text-gray-800">Peran</th>
                                        <th className="p-3 text-left text-gray-800">Status</th>
                                        <th className="p-3 text-center text-gray-800">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.map((user, index) => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleSelectUser(user.id)}
                                                />
                                            </td>
                                            <td className="p-3 text-gray-700">{index + 1}</td>
                                            <td className="p-3 text-gray-800 font-medium">{user.name}</td>
                                            <td className="p-3 text-gray-700">{user.email}</td>
                                            <td className="p-3 text-gray-800 font-semibold">{user.role}</td>
                                            <td className="p-3 text-gray-700">
                                                <span className={`px-2 py-1 rounded-full text-xs 
                                                    ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                                `}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                    title="Hapus Pengguna"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* No Users Found */}
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-4 text-gray-600">
                                Tidak ada pengguna ditemukan
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-2">
                            <div className="text-gray-700">
                                Menampilkan {paginatedUsers.length} dari {filteredUsers.length} pengguna
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronLeft className="text-gray-700" />
                                </button>
                                <span className="px-4 py-2 bg-blue-50 rounded-lg text-gray-800">
                                    Halaman {currentPage} dari {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronRight className="text-gray-700" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}