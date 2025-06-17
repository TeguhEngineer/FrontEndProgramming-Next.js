"use client";
import Link from "next/link";
import { Search, Menu, User, LogOut, Package, Users, ChevronDown, CalendarCheck, LogIn } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dataMasterOpen, setDataMasterOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ name: string; avatar: string } | null>(null);

  // Cek status login saat komponen dimount dan saat ada perubahan
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const user = localStorage.getItem('userData');

      setIsLoggedIn(loggedIn);
      if (user) {
        setUserData(JSON.parse(user));
      }
    };

    checkAuth();

    // Tambahkan event listener untuk perubahan di tab lain
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = async () => {
    // Hapus data auth
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('token');

    // Update state
    setIsLoggedIn(false);
    setUserData(null);
    setUserMenuOpen(false);

    // Redirect dan force refresh state
    router.replace('/login');
    router.refresh(); // Untuk Next.js 13+
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center flex-wrap fixed top-0 w-full z-50 shadow-md">
      {/* Logo/Brand */}
      <div className="text-2xl font-bold hover:text-yellow-500 hidden md:block">BookingRooms</div>

      {/* Search Bar (hanya tampil saat login) */}
      {isLoggedIn && (
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 pl-10 rounded-md bg-gray-800 text-white focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={16} />
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Navigation Links */}
      <ul className={`md:flex space-x-6 absolute md:relative bg-gray-900 md:bg-transparent w-full md:w-auto left-0 top-14 md:top-auto transition-all duration-300 ease-in-out transform ${menuOpen ? 'block' : 'hidden'}`}>
        {/* Mobile Logo */}
        <li className="p-2 md:p-0">
          <Link href="/" className="cursor-text pl-7 text-2xl font-bold hover:text-yellow-500 md:hidden">BookingRooms</Link>
        </li>

        {/* Tampilkan menu utama hanya jika login */}
        {isLoggedIn ? (
          <>
            <li className="p-2 md:p-0">
              <Link href="/dashboard" className="p-2 hover:bg-gray-700 rounded-md block">Dashboard</Link>
            </li>
            <li className="p-2 md:p-0 relative">
              <button
                onClick={() => setDataMasterOpen(!dataMasterOpen)}
                className="p-2 hover:bg-gray-700 rounded-md w-full flex items-center"
              >
                Data Master <ChevronDown size={16} className="ml-1" />
              </button>
              {dataMasterOpen && (
                <ul className="absolute bg-gray-800 mt-2 rounded-md shadow-md p-3 transition-all duration-300 ease-in-out transform origin-top scale-100">
                  <li className="p-3 hover:bg-gray-700 rounded-md">
                    <Link href="/room" className="flex items-center">
                      <Package className="mr-2" size={16} /> Rooms
                    </Link>
                  </li>
                  <li className="p-3 hover:bg-gray-700 rounded-md">
                    <Link href="/booking" className="flex items-center">
                      <CalendarCheck className="mr-2" size={16} /> Booking
                    </Link>
                  </li>
                  <li className="p-3 hover:bg-gray-700 rounded-md">
                    <Link href="/users" className="flex items-center">
                      <Users className="mr-2" size={16} /> Users
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </>
        ) : (
          // Tampilkan menu guest jika belum login
          <li className="p-2 md:p-0">
            <Link href="/" className="p-2 hover:bg-gray-700 rounded-md block">Home</Link>
          </li>
        )}
      </ul>

      {/* User Section */}
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          // Tampilan saat sudah login
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2"
            >
              {userData?.avatar ? (
                <Image
                  src={userData.avatar}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <User size={18} />
                </div>
              )}
              <div className="text-sm hover:text-blue-500 flex items-center">
                {userData?.name || 'User'} <ChevronDown size={16} className="ml-1" />
              </div>
            </button>
            {userMenuOpen && (
              <ul className="absolute right-0 bg-gray-800 mt-2 rounded-md shadow-md p-3 transition-all duration-300 ease-in-out transform origin-top scale-100">
                <li className="p-3 hover:bg-gray-700 rounded-md">
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2" size={16} /> Profile
                  </Link>
                </li>
                <li className="p-3 hover:bg-gray-700 rounded-md">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full"
                  >
                    <LogOut className="mr-2" size={16} /> Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          // Tampilan saat belum login
          <div className="flex space-x-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-md bg-transparent hover:bg-gray-800 flex items-center"
            >
              <LogIn className="mr-2" size={16} /> Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 flex items-center"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;