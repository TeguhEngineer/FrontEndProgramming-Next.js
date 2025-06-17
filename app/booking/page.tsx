"use client";
import { useEffect, useState } from "react";

interface Booking {
    id: number;
    bookingDate: string;
    roomId: number;
    roomName?: string; // Ditambahkan untuk menampilkan nama ruangan
}

interface Room {
    id: number;
    name: string;
}

export default function BookingTable() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [roomId, setRoomId] = useState(0);
    const [bookingId, setBookingId] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleGet = async (accessToken: string) => {
        try {
            const response = await fetch("https://simaru.amisbudi.cloud/api/bookings", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
                },
            });
            const { data } = await response.json();
            if (data) {
                setBookings(data);
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
        }
    };

    // useEffect(() => {
    //     const accessToken = localStorage.getItem("accessToken");
    //     if (accessToken) {
    //         handleGet(accessToken);
    //     }
    // }, []);

    const fetchRooms = async () => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            const response = await fetch("https://simaru.amisbudi.cloud/api/rooms", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
                },
            });

            const { data } = await response.json();
            setRooms(data);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const accessToken = localStorage.getItem("accessToken"); // ✅ Ambil token di sini
        if (!accessToken) {
            console.error("Access token not found");
            return;
        }
        try {
            const payload = {
                bookingDate: bookingDate,
                roomId: roomId,
            };

            const response = await fetch("https://simaru.amisbudi.cloud/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
                },
                body: JSON.stringify(payload),
            });

            const { data, message } = await response.json();
            console.log(data);
            if (data) {
                setMessage(message);
                setIsSuccess(true);
                setIsOpen(false);
                setTimeout(() => setIsSuccess(false), 3000);
                handleGet(accessToken);
            }
        } catch (err) {
            console.error('Error adding booking:', err);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        const accessToken = localStorage.getItem("accessToken"); // ✅ Ambil token di sini
        if (!accessToken) {
            console.error("Access token not found");
            return;
        }
        try {
            const payload = {
                bookingDate: bookingDate,
                roomId: roomId,
            };

            const response = await fetch(`https://simaru.amisbudi.cloud/api/bookings/${bookingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
                },
                body: JSON.stringify(payload),
            });

            const { data, message } = await response.json();
            console.log(data);
            if (data) {
                setMessage(message);
                setIsSuccess(true);
                setIsEdit(false);
                setTimeout(() => setIsSuccess(false), 3000);
                handleGet(accessToken);
            }
        } catch (err) {
            console.error('Error updating booking:', err);
        }
    };

    const handleDelete = async () => {
        const accessToken = localStorage.getItem("accessToken"); // ✅ Ambil token di sini
        if (!accessToken) {
            console.error("Access token not found");
            return;
        }
        try {
            const response = await fetch(`https://simaru.amisbudi.cloud/api/bookings/${bookingId}`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            });

            const { data, message } = await response.json();
            console.log(data);
            if (data) {
                setMessage(message);
            }
        } catch (err) {
            console.error('Error deleting booking:', err);
        } finally {
            setIsSuccess(true);
            setIsDelete(false);
            setTimeout(() => setIsSuccess(false), 3000);
            handleGet(accessToken);
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken"); // ✅ Ambil token di sini
        if (!accessToken) {
            console.error("Access token not found");
            return;
        }
        handleGet(accessToken);
        fetchRooms();
    }, []);

    const actionModal = () => {
        setIsOpen(!isOpen);
        setBookingDate("");
        setRoomId(0);
    };

    const actionModalEdit = () => {
        setIsEdit(!isEdit);
    };

    const actionModalDelete = () => {
        setIsDelete(!isDelete);
    };

    const actionEdit = (booking: Booking) => {
        setBookingId(booking.id);
        setIsEdit(true);
        setBookingDate(booking.bookingDate);
        setRoomId(booking.roomId);
    };

    const actionDelete = (booking: Booking) => {
        setBookingId(booking.id);
        setIsDelete(true);
    };

    const filteredBookings = bookings.filter((booking) =>
        booking.bookingDate.toLowerCase().includes(search.toLowerCase()) ||
        (rooms.find(room => room.id === booking.roomId)?.name.toLowerCase().includes(search.toLowerCase()) || "")
    );

    return (
        <>
            {isOpen && (
                <div id="default-modal" className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60 backdrop-blur-sm">
                    <div className="relative p-6 w-full max-w-2xl max-h-full animate-in zoom-in-95 duration-300">
                        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                        Tambah Data Booking
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={actionModal}
                                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl p-2 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label htmlFor="bookingDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                                📅 Tanggal Booking
                                            </label>
                                            <input
                                                type="date"
                                                onChange={(e) => setBookingDate(e.target.value)}
                                                id="bookingDate"
                                                name="bookingDate"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="room" className="block text-sm font-semibold text-gray-700 mb-2">
                                                🏢 Ruangan
                                            </label>
                                            <select
                                                id="room"
                                                name="room"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                onChange={(e) => setRoomId(Number(e.target.value))}
                                                required
                                                value={roomId}
                                            >
                                                <option value="">Pilih Ruangan</option>
                                                {rooms.map((room) => (
                                                    <option key={room.id} value={room.id}>
                                                        {room.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end p-6 border-t border-gray-100 space-x-3">
                                    <button
                                        type="button"
                                        onClick={actionModal}
                                        className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                    >
                                        Kembali
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isEdit && (
                <div id="default-modal" className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60 backdrop-blur-sm">
                    <div className="relative p-6 w-full max-w-2xl max-h-full animate-in zoom-in-95 duration-300">
                        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                        Edit Data Booking
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={actionModalEdit}
                                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl p-2 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleUpdate}>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label htmlFor="bookingDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                                📅 Tanggal Booking
                                            </label>
                                            <input
                                                type="date"
                                                value={bookingDate}
                                                onChange={(e) => setBookingDate(e.target.value)}
                                                id="bookingDate"
                                                name="bookingDate"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="room" className="block text-sm font-semibold text-gray-700 mb-2">
                                                🏢 Ruangan
                                            </label>
                                            <select
                                                id="room"
                                                name="room"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                onChange={(e) => setRoomId(Number(e.target.value))}
                                                required
                                                value={roomId}
                                            >
                                                <option value="">Pilih Ruangan</option>
                                                {rooms.map((room) => (
                                                    <option key={room.id} value={room.id}>
                                                        {room.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end p-6 border-t border-gray-100 space-x-3">
                                    <button
                                        type="button"
                                        onClick={actionModalEdit}
                                        className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                    >
                                        Kembali
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isDelete && (
                <div id="default-modal" className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60 backdrop-blur-sm">
                    <div className="relative p-6 w-full max-w-md max-h-full animate-in zoom-in-95 duration-300">
                        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                        Hapus Data Booking
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={actionModalDelete}
                                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl p-2 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="text-center mb-6">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                        <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-800 mb-2">Konfirmasi Penghapusan</p>
                                    <p className="text-gray-600">Apakah Anda yakin ingin menghapus booking ini? Tindakan ini tidak dapat dibatalkan.</p>
                                </div>
                                <div className="flex items-center justify-center space-x-3">
                                    <button
                                        onClick={actionModalDelete}
                                        className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 rounded-xl hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isSuccess && (
                <div role="alert" className="fixed top-6 right-6 max-w-md rounded-2xl border border-green-200 bg-white shadow-2xl z-50 animate-in slide-in-from-right-full duration-500">
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-lg font-bold text-gray-900 mb-1">{message}</p>
                                <p className="text-sm text-gray-600">Data booking telah berhasil diproses.</p>
                            </div>
                            <button
                                className="flex-shrink-0 ml-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                                type="button"
                                onClick={() => setIsSuccess(false)}
                                aria-label="Dismiss alert"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                        <div className="mb-6 lg:mb-0">
                            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-800 via-gray-700 to-blue-800 bg-clip-text text-transparent pb-2">
                                Data Booking
                            </h1>
                            <p className="text-gray-600 text-lg">Kelola semua data booking dengan mudah dan efisien</p>
                        </div>
                        <div>
                            <button
                                onClick={actionModal}
                                className="group relative inline-flex items-center px-6 py-3 overflow-hidden text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <svg className="w-5 h-5 mr-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="relative z-10">Tambah Booking</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">
                        <div className="mb-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="🔍 Cari berdasarkan tanggal atau ruangan..."
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                                                Tanggal Booking
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                                                Ruangan
                                            </th>
                                            <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {filteredBookings.length > 0 ? (
                                            filteredBookings.map((booking, index) => (
                                                <tr key={booking.id} className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-black text-sm font-bold">{booking.id}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {new Date(booking.bookingDate).toLocaleDateString('id-ID', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                                                            {rooms.find((room) => room.id == booking.roomId)?.name || "Unknown"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="flex justify-center space-x-3">
                                                            <button
                                                                onClick={() => actionEdit(booking)}
                                                                className="group relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                                                            >
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => actionDelete(booking)}
                                                                className="group relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                                                            >
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
                                                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-xl font-semibold text-gray-500 mb-2">
                                                            {bookings.length === 0 ? "📊 Memuat data booking..." : "🔍 Tidak ditemukan booking yang sesuai"}
                                                        </p>
                                                        <p className="text-gray-400">
                                                            {bookings.length === 0 ? "Mohon tunggu sebentar..." : "Coba ubah kata kunci pencarian Anda"}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}