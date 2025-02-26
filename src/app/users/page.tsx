'use client';
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function User() {
    const [users, setUsers] = useState([]); // Menyimpan data pengguna
    const [searchTerm, setSearchTerm] = useState(""); // Menyimpan kata kunci pencarian
    const [filteredUsers, setFilteredUsers] = useState([]); // Menyimpan hasil pencarian
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Menyimpan konfigurasi pengurutan
    const [newUser, setNewUser] = useState({ name: '', email: '' }); // Menyimpan data user baru
    const [currentPage, setCurrentPage] = useState(1); // Menyimpan halaman saat ini
    const itemsPerPage = 5; // Jumlah data per halaman

    useEffect(() => {
        // Mengambil data dari file users.json
        fetch('/users.json')
            .then(response => response.json())
            .then(data => {
                setUsers(data); // Simpan data pengguna
                setFilteredUsers(data); // Setel data awal untuk hasil pencarian
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    // Fungsi untuk memfilter data berdasarkan kata kunci pencarian
    useEffect(() => {
        const results = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(results); // Perbarui hasil pencarian
        setCurrentPage(1); // Reset ke halaman pertama setelah pencarian
    }, [searchTerm, users]);

    // Fungsi untuk mengurutkan data
    const sortData = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sortedData = [...filteredUsers].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1; if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredUsers(sortedData);
    };

    // Fungsi untuk menangani perubahan input form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    // Fungsi untuk menambahkan user baru
    const handleAddUser = (e) => {
        e.preventDefault();
        const userToAdd = { ...newUser, id: users.length + 1 };
        setUsers([...users, userToAdd]); // Tambahkan user baru ke state
        setFilteredUsers([...filteredUsers, userToAdd]); // Perbarui hasil pencarian
        setNewUser({ name: '', email: '' }); // Reset form
        toast.success('Data berhasil ditambahkan!'); // Tampilkan toast
    };

    // Fungsi untuk menghitung data yang ditampilkan per halaman
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    // Fungsi untuk mengganti halaman
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gray-100 p-6 pt-24 text-gray-900">
            <ToastContainer position="top-right" autoClose={3000} />
            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card Form Tambah User (Sebelah Kiri) */}
                <div className="bg-white p-6 rounded-lg shadow-md h-fit sticky top-6">
                    <h2 className="text-lg font-semibold mb-4">Add New User</h2>
                    <form onSubmit={handleAddUser}>
                        <div className="space-y-4">
                            <input type="text" name="name" placeholder="Name" value={newUser.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required />
                            <input type="email" name="email" placeholder="Email" value={newUser.email}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required />
                        </div>
                        <button type="submit"
                            className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            Add User
                        </button>
                    </form>
                </div>

                {/* Tabel dan Pencarian (Sebelah Kanan) */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {/* Input Pencarian */}
                    <div className="mb-4 flex justify-between ">
                        <h2 className="text-lg font-semibold mb-4 items-center">Detail data</h2>
                        <input type="text" placeholder="Search by name or email..." value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Tabel Pengguna */}
                    <div className="overflow-auto max-h-[70vh]">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b cursor-pointer" onClick={() => sortData('id')}
                                    >
                                        ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' :
                                            '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b cursor-pointer" onClick={() => sortData('name')}
                                    >
                                        Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' :
                                            '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b cursor-pointer" onClick={() => sortData('email')}
                                    >
                                        Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' :
                                            '↓')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{user.id}</td>
                                        <td className="py-2 px-4 border-b">{user.name}</td>
                                        <td className="py-2 px-4 border-b">{user.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <button onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {Math.ceil(filteredUsers.length / itemsPerPage)}
                        </span>
                        <button onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
