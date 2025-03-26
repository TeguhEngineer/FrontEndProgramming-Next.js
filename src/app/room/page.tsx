"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Room {
    id: number;
    nama: string;
    kapasitas: number;
    lokasi: string;
    status: string;
    fasilitas: string[];
    luas: number;
}

export default function RoomTable() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const itemsPerPage = 5;

    // Modal add data room
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRoom, setNewRoom] = useState<Room>({
        id: 0,
        nama: '',
        kapasitas: 0,
        lokasi: '',
        status: 'Tersedia',
        fasilitas: [],
        luas: 0
    });

    const fasilitasOptions = ['AC', 'Proyektor', 'WiFi', 'Papan Tulis', 'Sound System'];

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewRoom(prev => ({
            ...prev,
            [name]: name === "kapasitas" || name === "luas" ? Number(value) : value
        }));
    };

    const handleFasilitasChange = (fasilitas: string) => {
        setNewRoom(prev => ({
            ...prev,
            fasilitas: prev.fasilitas.includes(fasilitas)
                ? prev.fasilitas.filter(f => f !== fasilitas)
                : [...prev.fasilitas, fasilitas]
        }));
    };


    const handleAddRoom = () => {
        if (!newRoom.nama || !newRoom.lokasi || newRoom.kapasitas <= 0) {
            alert("Harap lengkapi data ruangan!");
            return;
        }
        setRooms(prevRooms => [
            ...prevRooms,
            { ...newRoom, id: prevRooms.length + 1 }
        ]);
        closeModal();
    };


    // Fetch data saat komponen dimuat
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch('/rooms.json');
                const data = await response.json();
                setRooms(data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    // Fungsi pencarian dan filter ruangan
    const filteredRooms = useMemo(() => {
        return rooms.filter(room =>
            room.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.fasilitas.some(fasilitas =>
                fasilitas.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [rooms, searchTerm]);

    // Pagination
    const paginatedRooms = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredRooms.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredRooms, currentPage]);

    // Fungsi menghapus ruangan berdasarkan ID
    const handleDeleteRoom = (id: number) => {
        const updatedRooms = rooms.filter(room => room.id !== id);
        setRooms(updatedRooms);
        // Reset halaman jika ruangan di halaman terakhir dihapus
        if (paginatedRooms.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Fungsi menghapus ruangan yang dipilih
    const handleDeleteSelectedRooms = () => {
        const updatedRooms = rooms.filter(
            room => !selectedRooms.includes(room.id)
        );
        setRooms(updatedRooms);
        setSelectedRooms([]);
        // Reset halaman jika ruangan di halaman terakhir dihapus
        if (paginatedRooms.length <= selectedRooms.length && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Fungsi toggle seleksi ruangan
    const handleSelectRoom = (id: number) => {
        setSelectedRooms(prev =>
            prev.includes(id)
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
        );
    };

    // Fungsi toggle seleksi semua ruangan di halaman saat ini
    const handleSelectAllOnPage = () => {
        const pageRoomIds = paginatedRooms.map(room => room.id);
        const allSelected = pageRoomIds.every(id => selectedRooms.includes(id));

        if (allSelected) {
            // Jika semua sudah dipilih, hapus semua dari seleksi
            setSelectedRooms(prev =>
                prev.filter(selectedId => !pageRoomIds.includes(selectedId))
            );
        } else {
            // Tambahkan ID ruangan yang belum dipilih
            setSelectedRooms(prev => [
                ...prev.filter(selectedId => !pageRoomIds.includes(selectedId)),
                ...pageRoomIds.filter(id => !prev.includes(id))
            ]);
        }
    };

    // Hitung jumlah halaman
    const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

    return (

        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="container mx-auto max-w-6xl mt-16">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
                            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-2/3 lg:w-1/2" onClick={(e) => e.stopPropagation()}>
                                <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Tambah Ruangan</h2>

                                {/* Nama Ruangan */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Nama Ruangan</label>
                                    <input type="text" name="nama" value={newRoom.nama} onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md text-gray-700" />
                                </div>

                                {/* Lokasi */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                                    <input type="text" name="lokasi" value={newRoom.lokasi} onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md text-gray-700" />
                                </div>

                                {/* Kapasitas */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Kapasitas</label>
                                    <input type="number" name="kapasitas" value={newRoom.kapasitas} onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md text-gray-700" />
                                </div>

                                {/* Status */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select name="status" value={newRoom.status} onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md text-gray-700">
                                        <option value="Tersedia">Tersedia</option>
                                        <option value="Tidak Tersedia">Tidak Tersedia</option>
                                    </select>
                                </div>

                                {/* Fasilitas */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Fasilitas</label>
                                    <div className="flex flex-wrap gap-2">
                                        {fasilitasOptions.map(fasilitas => (
                                            <label key={fasilitas} className="flex items-center space-x-2 text-gray-700">
                                                <input type="checkbox" checked={newRoom.fasilitas.includes(fasilitas)}
                                                    onChange={() => handleFasilitasChange(fasilitas)} />
                                                <span>{fasilitas}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Luas */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Luas (m²)</label>
                                    <input type="number" name="luas" value={newRoom.luas} onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md text-gray-700" />
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex justify-end gap-2 mt-4">
                                    <button onClick={closeModal} className="px-4 py-2 bg-gray-400 rounded-lg text-white">Batal</button>
                                    <button onClick={handleAddRoom} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Tambah</button>
                                </div>
                            </div>
                        </div>
                    )};



                    {/* Header */}
                    <div className="bg-blue-50 p-4 md:p-6 border-b border-gray-200 flex w-full">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Master Ruangan</h1>

                        <button
                            onClick={openModal}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ms-auto"
                        >
                            + Add Ruangan
                        </button>
                    </div>



                    {/* Kontrol Pencarian dan Hapus Terpilih */}
                    <div className="p-4 md:p-6 bg-white">
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Cari ruangan..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                            {selectedRooms.length > 0 && (
                                <button
                                    onClick={handleDeleteSelectedRooms}
                                    className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 gap-2"
                                >
                                    <Trash2 size={18} />
                                    Hapus Terpilih ({selectedRooms.length})
                                </button>
                            )}
                        </div>

                        {/* Tabel Ruangan */}
                        <div className="w-full overflow-x-auto">
                            <table className="w-full min-w-max border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 text-left w-12">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                                checked={paginatedRooms.length > 0 &&
                                                    paginatedRooms.every(room => selectedRooms.includes(room.id))}
                                                onChange={handleSelectAllOnPage}
                                            />
                                        </th>
                                        <th className="p-3 text-left text-gray-800">No.</th>
                                        <th className="p-3 text-left text-gray-800">Nama Ruangan</th>
                                        <th className="p-3 text-left text-gray-800">Lokasi</th>
                                        <th className="p-3 text-left text-gray-800">Kapasitas</th>
                                        <th className="p-3 text-left text-gray-800">Status</th>
                                        <th className="p-3 text-left text-gray-800">Fasilitas</th>
                                        <th className="p-3 text-left text-gray-800">Luas</th>
                                        <th className="p-3 text-center text-gray-800">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedRooms.map((room, index) => (
                                        <tr key={room.id} className="border-b hover:bg-gray-50 transition">
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                                    checked={selectedRooms.includes(room.id)}
                                                    onChange={() => handleSelectRoom(room.id)}
                                                />
                                            </td>
                                            <td className="p-3 text-gray-700">{index + 1}</td>
                                            <td className="p-3 text-gray-800 font-medium">{room.nama}</td>
                                            <td className="p-3 text-gray-700">{room.lokasi}</td>
                                            <td className="p-3 text-gray-800 font-semibold">{room.kapasitas} orang</td>
                                            <td className="p-3 text-gray-700">
                                                <span className={`px-2 py-1 rounded-full text-xs 
                            ${room.status === 'Tersedia' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        `}>
                                                    {room.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-gray-700">
                                                {room.fasilitas.join(', ')}
                                            </td>
                                            <td className="p-3 text-gray-700">{room.luas} m²</td>
                                            <td className="p-3 text-center">
                                                <button
                                                    onClick={() => handleDeleteRoom(room.id)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                    title="Hapus Ruangan"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Tidak ada ruangan */}
                        {filteredRooms.length === 0 && (
                            <div className="text-center py-4 text-gray-600">
                                Tidak ada ruangan ditemukan
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-2">
                            <div className="text-gray-700">
                                Menampilkan {paginatedRooms.length} dari {filteredRooms.length} ruangan
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