"use client";
import { useEffect, useState } from "react";

interface Room {
    id: number;
    name: string;
    categoryId: number;
    price: number;
    capacity: number;
    description: string;
    status: string;
}

interface Category {
    id: number;
    name: string;
}

export default function RoomTable() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [roomName, setRoomName] = useState("");
    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState(0);
    const [categoryId, setCategoryId] = useState(0);
    const [price, setPrice] = useState(0);
    const [capacity, setCapacity] = useState(0);
    const [desc, setDesc] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isSuccess, setISuccess] = useState(false); // pesan untuk menyimpan data
    const [isEditAlert, setEditAlert] = useState(false); // pesan untuk menyimpan data
    const [isDeleteAlert, setDeleteAlert] = useState(false); // pesan untuk menyimpan data

    // const accessToken = localStorage.getItem("accessToken");

    const handleGet = async (accessToken: string) => {
        try {
            const response = await fetch("https://simaru.amisbudi.cloud/api/rooms", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
                },
            });
            const { data } = await response.json();
            console.log(data);
            if (data) {
                setRooms(data);
            }
        } catch (err) {
            console.error('Error fetching rooms:', err);
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
                name: name,
                categoryId: categoryId,
                price: price,
                capacity: capacity,
                description: desc,
            };

            const response = await fetch("https://simaru.amisbudi.cloud/api/rooms", {
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
                setRoomName(data.name);
                setISuccess(true);
                setIsOpen(false);
                setTimeout(() => setISuccess(false), 3000);
                handleGet(accessToken);
            }
        } catch (err) {
            console.error('Error adding room:', err);
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
                name: name,
                categoryId: categoryId,
                price: price,
                capacity: capacity,
                description: desc,
            };

            const response = await fetch(`https://simaru.amisbudi.cloud/api/rooms/${roomId}`, {
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
                setRoomName(data.name);
                setEditAlert(true);
                setIsEdit(false);
                setTimeout(() => setEditAlert(false), 3000);
                handleGet(accessToken);
            }
        } catch (err) {
            console.error('Error updating room:', err);
        }
    };

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();

        const accessToken = localStorage.getItem("accessToken"); // ✅ Ambil token di sini
        if (!accessToken) {
            console.error("Access token not found");
            return;
        }
        try {
            const payload = {
                name: name,
                categoryId: categoryId,
                price: price,
                capacity: capacity,
                description: desc,
            };

            const response = await fetch(`https://simaru.amisbudi.cloud/api/rooms/${roomId}`, {
                method: "DELETE",
                headers: {
                    // "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
                },
                body: JSON.stringify(payload),
            });

            const { data, message } = await response.json();
            console.log(data);
            if (data) {
                setMessage(message);
                setRoomName(data.name);
            }
        } catch (err) {
            // setError('An error occurred. Please try again.');
        } finally {
            setMessage(message);
            setDeleteAlert(true);
            setIsDelete(false);
            setTimeout(() => setDeleteAlert(false), 3000);
            handleGet(accessToken);
        }
    };

    const fetchCategories = async () => {
        const accessToken = localStorage.getItem("accessToken"); // ✅ Ambil token di sini
        if (!accessToken) {
            console.error("Access token not found");
            return;
        }
        try {
            const response = await fetch("https://simaru.amisbudi.cloud/api/categories", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
                },
            });

            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken"); // ✅ Ambil token di sini
        if (!accessToken) {
            console.error("Access token not found");
            return;
        }
        handleGet(accessToken);
        fetchCategories();
    }, []);

    const actionModal = () => {
        setIsOpen(!isOpen);
        setName("");
        setCategoryId(0);
        setPrice(0);
        setCapacity(0);
        setDesc("");
    };

    const actionModalEdit = () => {
        setIsEdit(!isEdit);
    };

    const actionModalDelete = () => {
        setIsDelete(!isDelete);
    };

    const actionEdit = (room: Room) => {
        setRoomId(room.id);
        setIsEdit(true);
        setName(room.name);
        setCategoryId(room.categoryId);
        setPrice(room.price);
        setCapacity(room.capacity);
        setDesc(room.description);
    };

    const actionDelete = (room: Room) => {
        setRoomId(room.id);
        setIsDelete(true);
        setName(room.name);
    };

    const filteredRooms = rooms.filter((room) =>
        room.name.toLowerCase().includes(search.toLowerCase()) ||
        (categories.find(cat => cat.id === room.categoryId)?.name.toLowerCase().includes(search.toLowerCase()) || "")
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
                                        Tambah Data Ruangan
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                                🏢 Nama Ruangan
                                            </label>
                                            <input
                                                type="text"
                                                onChange={(e) => setName(e.target.value)}
                                                id="name"
                                                name="name"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                                🏷️ Kategori Ruangan
                                            </label>
                                            <select
                                                id="category"
                                                name="category"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                onChange={(e) => setCategoryId(Number(e.target.value))}
                                                required
                                                value={categoryId}
                                            >
                                                <option value="">Pilih Kategori</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                                                💵 Harga
                                            </label>
                                            <input
                                                type="number"
                                                onChange={(e) => setPrice(Number(e.target.value))}
                                                id="price"
                                                name="price"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="capacity" className="block text-sm font-semibold text-gray-700 mb-2">
                                                👥 Kapasitas
                                            </label>
                                            <input
                                                type="number"
                                                onChange={(e) => setCapacity(Number(e.target.value))}
                                                id="capacity"
                                                name="capacity"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                            📝 Deskripsi
                                        </label>
                                        <textarea
                                            onChange={(e) => setDesc(e.target.value)}
                                            id="description"
                                            name="description"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                            required
                                            rows={3}
                                        />
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
                                        Edit Data Ruangan
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                                🏢 Nama Ruangan
                                            </label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                id="name"
                                                name="name"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                                🏷️ Kategori Ruangan
                                            </label>
                                            <select
                                                id="category"
                                                name="category"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                onChange={(e) => setCategoryId(Number(e.target.value))}
                                                required
                                                value={categoryId}
                                            >
                                                <option value="">Pilih Kategori</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                                                💵 Harga
                                            </label>
                                            <input
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(Number(e.target.value))}
                                                id="price"
                                                name="price"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="capacity" className="block text-sm font-semibold text-gray-700 mb-2">
                                                👥 Kapasitas
                                            </label>
                                            <input
                                                type="number"
                                                value={capacity}
                                                onChange={(e) => setCapacity(Number(e.target.value))}
                                                id="capacity"
                                                name="capacity"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                            📝 Deskripsi
                                        </label>
                                        <textarea
                                            value={desc}
                                            onChange={(e) => setDesc(e.target.value)}
                                            id="description"
                                            name="description"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                            required
                                            rows={3}
                                        />
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
                                        Hapus Data Ruangan
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
                                    <p className="text-gray-600">Apakah Anda yakin ingin menghapus ruangan '{name}'? Tindakan ini tidak dapat dibatalkan.</p>
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
                                <p className="text-sm text-gray-600">Data ruangan berhasil disimpan.</p>
                            </div>
                            <button
                                className="flex-shrink-0 ml-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                                type="button"
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

            {isEditAlert && (
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
                                <p className="text-sm text-gray-600">Data ruangan berhasil diperbarui.</p>
                            </div>
                            <button
                                className="flex-shrink-0 ml-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                                type="button"
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

            {isDeleteAlert && (
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
                                <p className="text-sm text-gray-600">Data ruangan berhasil dihapus.</p>
                            </div>
                            <button
                                className="flex-shrink-0 ml-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                                type="button"
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
                                Data Ruangan
                            </h1>
                            <p className="text-gray-600 text-lg">Kelola semua data ruangan dengan mudah dan efisien</p>
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
                                <span className="relative z-10">Tambah Ruangan</span>
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
                                    placeholder="🔍 Cari berdasarkan nama atau kategori..."
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
                                                Nama Ruangan
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                                                Kategori
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                                                Harga
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                                                Kapasitas
                                            </th>
                                            <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {filteredRooms.length > 0 ? (
                                            filteredRooms.map((room, index) => (
                                                <tr key={room.id} className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-black text-sm font-bold">{room.id}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {room.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {categories.find((cat) => cat.id == room.categoryId)?.name || "Unknown"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            Rp{room.price.toLocaleString('id-ID')}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {room.capacity} orang
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="flex justify-center space-x-3">
                                                            <button
                                                                onClick={() => actionEdit(room)}
                                                                className="group relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                                                            >
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => actionDelete(room)}
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
                                                <td colSpan={6} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
                                                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-xl font-semibold text-gray-500 mb-2">
                                                            {rooms.length === 0 ? "📊 Memuat data ruangan..." : "🔍 Tidak ditemukan ruangan yang sesuai"}
                                                        </p>
                                                        <p className="text-gray-400">
                                                            {rooms.length === 0 ? "Mohon tunggu sebentar..." : "Coba ubah kata kunci pencarian Anda"}
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