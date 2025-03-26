"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { Trash2, Search, ChevronLeft, ChevronRight, Calendar, Clock, User } from 'lucide-react';

// Define interfaces for Booking, Room, and User
interface Room {
    id: number;
    nama: string;
    kapasitas: number;
    lokasi: string;
    status: string;
}

interface User {
    id: number;
    nama: string;
    email: string;
    departemen: string;
}

interface Booking {
    id: number;
    roomId: number;
    userId: number;
    tanggalMulai: string;
    tanggalSelesai: string;
    jamMulai: string;
    jamSelesai: string;
    keperluan: string;
    status: 'Menunggu' | 'Disetujui' | 'Ditolak';
}

export default function BookingTable() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBookings, setSelectedBookings] = useState<number[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const itemsPerPage = 5;

    // Modal add booking
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBooking, setNewBooking] = useState<Booking>({
        id: 0,
        roomId: 0,
        userId: 0,
        tanggalMulai: '',
        tanggalSelesai: '',
        jamMulai: '',
        jamSelesai: '',
        keperluan: '',
        status: 'Menunggu'
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Filtering bookings (moved up to resolve initialization issue)
    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            const room = rooms.find(r => r?.id === booking.roomId);
            const user = users.find(u => u?.id === booking.userId);

            const searchTermLower = searchTerm.toLowerCase();

            return (
                // Safe toLowerCase checks with optional chaining
                (room?.nama?.toLowerCase?.()?.includes(searchTermLower) ?? false) ||
                (user?.nama?.toLowerCase?.()?.includes(searchTermLower) ?? false) ||
                booking.keperluan.toLowerCase().includes(searchTermLower) ||
                booking.status.toLowerCase().includes(searchTermLower)
            );
        });
    }, [bookings, searchTerm, rooms, users]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBookings, currentPage, itemsPerPage]);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomsResponse, usersResponse, bookingsResponse] = await Promise.all([
                    fetch('/rooms.json').then(res => res.json()),
                    fetch('/users.json').then(res => res.json()),
                    fetch('/bookings.json').then(res => res.json())
                ]);
                setRooms(roomsResponse);
                setUsers(usersResponse);
                setBookings(bookingsResponse);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Handle input changes for new booking
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewBooking(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle booking deletion
    const handleDeleteBooking = (bookingId: number) => {
        setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
        // Remove from selected bookings if it was selected
        setSelectedBookings(prev => prev.filter(id => id !== bookingId));
    };

    // Handle deleting selected bookings
    const handleDeleteSelectedBookings = () => {
        setBookings(prevBookings =>
            prevBookings.filter(booking => !selectedBookings.includes(booking.id))
        );
        setSelectedBookings([]); // Clear selected bookings
    };

    // Handle booking selection
    const handleSelectBooking = (bookingId: number) => {
        setSelectedBookings(prev =>
            prev.includes(bookingId)
                ? prev.filter(id => id !== bookingId)
                : [...prev, bookingId]
        );
    };

    // Handle select all bookings on current page
    const handleSelectAllOnPage = () => {
        const allSelected = paginatedBookings.every(booking =>
            selectedBookings.includes(booking.id)
        );

        if (allSelected) {
            // Deselect all on current page
            setSelectedBookings(prev =>
                prev.filter(id => !paginatedBookings.some(booking => booking.id === id))
            );
        } else {
            // Select all on current page
            const currentPageBookingIds = paginatedBookings.map(booking => booking.id);
            setSelectedBookings(prev => [
                ...prev.filter(id => !currentPageBookingIds.includes(id)),
                ...currentPageBookingIds
            ]);
        }
    };

    // Add new booking
    const handleAddBooking = () => {
        // Validation
        if (!newBooking.roomId || !newBooking.userId || !newBooking.tanggalMulai ||
            !newBooking.tanggalSelesai || !newBooking.jamMulai || !newBooking.jamSelesai) {
            alert("Harap lengkapi semua data booking!");
            return;
        }

        // Check room availability (simple check)
        const isRoomAvailable = !bookings.some(booking =>
            booking.roomId === newBooking.roomId &&
            booking.tanggalMulai === newBooking.tanggalMulai &&
            booking.status === 'Disetujui'
        );

        if (!isRoomAvailable) {
            alert("Ruangan sudah dibooking pada tanggal tersebut!");
            return;
        }

        setBookings(prevBookings => [
            ...prevBookings,
            { ...newBooking, id: prevBookings.length + 1 }
        ]);
        closeModal();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="container mx-auto max-w-6xl mt-16">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    {/* Modal for Adding Booking */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
                            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-2/3 lg:w-1/2" onClick={(e) => e.stopPropagation()}>
                                <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Tambah Booking</h2>

                                {/* Room Selection */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Ruangan</label>
                                    <select
                                        name="roomId"
                                        value={newBooking.roomId}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md text-gray-700"
                                    >
                                        <option value="">Pilih Ruangan</option>
                                        {rooms.map(room => (
                                            <option key={room.id} value={room.id}>
                                                {room.nama} - {room.lokasi}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* User Selection */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Pengguna</label>
                                    <select
                                        name="userId"
                                        value={newBooking.userId}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md text-gray-700"
                                    >
                                        <option value="">Pilih Pengguna</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.nama} - {user.departemen}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date Range */}
                                <div className="mb-3 flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                                        <input
                                            type="date"
                                            name="tanggalMulai"
                                            value={newBooking.tanggalMulai}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-md text-gray-700"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
                                        <input
                                            type="date"
                                            name="tanggalSelesai"
                                            value={newBooking.tanggalSelesai}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-md text-gray-700"
                                        />
                                    </div>
                                </div>

                                {/* Time Range */}
                                <div className="mb-3 flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Jam Mulai</label>
                                        <input
                                            type="time"
                                            name="jamMulai"
                                            value={newBooking.jamMulai}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-md text-gray-700"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Jam Selesai</label>
                                        <input
                                            type="time"
                                            name="jamSelesai"
                                            value={newBooking.jamSelesai}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-md text-gray-700"
                                        />
                                    </div>
                                </div>

                                {/* Purpose */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Keperluan</label>
                                    <input
                                        type="text"
                                        name="keperluan"
                                        value={newBooking.keperluan}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md text-gray-700"
                                        placeholder="Masukkan keperluan booking"
                                    />
                                </div>

                                {/* Status */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        name="status"
                                        value={newBooking.status}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md text-gray-700"
                                    >
                                        <option value="Menunggu">Menunggu</option>
                                        <option value="Disetujui">Disetujui</option>
                                        <option value="Ditolak">Ditolak</option>
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
                                        onClick={handleAddBooking}
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
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Master Booking</h1>

                        <button
                            onClick={openModal}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ms-auto"
                        >
                            + Add Booking
                        </button>
                    </div>

                    {/* Search and Delete Controls */}
                    <div className="p-4 md:p-6 bg-white">
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Cari booking..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                            {selectedBookings.length > 0 && (
                                <button
                                    onClick={handleDeleteSelectedBookings}
                                    className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 gap-2"
                                >
                                    <Trash2 size={18} />
                                    Hapus Terpilih ({selectedBookings.length})
                                </button>
                            )}
                        </div>

                        {/* Booking Table */}
                        <div className="w-full overflow-x-auto">
                            <table className="w-full min-w-max border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 text-left w-12">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                                checked={paginatedBookings.length > 0 &&
                                                    paginatedBookings.every(booking => selectedBookings.includes(booking.id))}
                                                onChange={handleSelectAllOnPage}
                                            />
                                        </th>
                                        <th className="p-3 text-left text-gray-800">No.</th>
                                        <th className="p-3 text-left text-gray-800">Ruangan</th>
                                        <th className="p-3 text-left text-gray-800">Pengguna</th>
                                        <th className="p-3 text-left text-gray-800">Tanggal</th>
                                        <th className="p-3 text-left text-gray-800">Jam</th>
                                        <th className="p-3 text-left text-gray-800">Keperluan</th>
                                        <th className="p-3 text-left text-gray-800">Status</th>
                                        <th className="p-3 text-center text-gray-800">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedBookings.map((booking, index) => {
                                        const room = rooms.find(r => r.id === booking.roomId);
                                        const user = users.find(u => u.id === booking.userId);

                                        return (
                                            <tr key={booking.id} className="border-b hover:bg-gray-50 transition">
                                                <td className="p-3">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                                        checked={selectedBookings.includes(booking.id)}
                                                        onChange={() => handleSelectBooking(booking.id)}
                                                    />
                                                </td>
                                                <td className="p-3 text-gray-700">{index + 1}</td>
                                                <td className="p-3 text-gray-800 font-medium">
                                                    {room ? room.nama : 'N/A'}
                                                </td>
                                                <td className="p-3 text-gray-700">
                                                    {user ? user.nama : 'N/A'}
                                                </td>
                                                <td className="p-3 text-gray-700 flex items-center gap-1">
                                                    <Calendar size={16} className="text-gray-500" />
                                                    {booking.tanggalMulai} - {booking.tanggalSelesai}
                                                </td>
                                                <td className="p-3 text-gray-700 flex items-center gap-1">
                                                    <Clock size={16} className="text-gray-500" />
                                                    {booking.jamMulai} - {booking.jamSelesai}
                                                </td>
                                                <td className="p-3 text-gray-700">{booking.keperluan}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs 
                                                        ${booking.status === 'Disetujui' ? 'bg-green-100 text-green-800'
                                                            : booking.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'}
                                                    `}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <button
                                                        onClick={() => handleDeleteBooking(booking.id)}
                                                        className="text-red-500 hover:text-red-700 transition"
                                                        title="Hapus Booking"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* No Bookings Found */}
                        {filteredBookings.length === 0 && (
                            <div className="text-center py-4 text-gray-600">
                                Tidak ada booking ditemukan
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-2">
                            <div className="text-gray-700">
                                Menampilkan {paginatedBookings.length} dari {filteredBookings.length} booking
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