"use client";
import Link from "next/link";
import { Search, Menu, User, LogOut, Package, Users, ChevronDown, CalendarCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dataMasterOpen, setDataMasterOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center flex-wrap fixed top-0 w-full z-50 shadow-md">
      <div className="text-2xl font-bold hover:text-yellow-500 hidden md:block">BookingRooms</div>
      <div className="relative hidden md:block">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 pl-10 rounded-md bg-gray-800 text-white focus:outline-none"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={16} />
      </div>

      <button
        className="md:hidden p-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu size={24} />
      </button>

      <ul className={`md:flex space-x-6 absolute md:relative bg-gray-900 md:bg-transparent w-full md:w-auto left-0 top-14 md:top-auto transition-all duration-300 ease-in-out transform ${menuOpen ? 'block' : 'hidden'}`}>
        <li className="p-2 md:p-0"><Link href="/" className="cursor-text pl-7 text-2xl font-bold hover:text-yellow-500 md:hidden ">BookingRooms</Link></li>
        <li className="p-2 md:p-0"><Link href="/" className="p-2 hover:bg-gray-700 rounded-md block">Dashboard</Link></li>
        <li className="p-2 md:p-0 relative">
          <button onClick={() => setDataMasterOpen(!dataMasterOpen)} className="p-2 hover:bg-gray-700 rounded-md w-full flex items-center">Data Master <ChevronDown size={16} className="ml-1" /></button>
          {dataMasterOpen && (
            <ul className="absolute bg-gray-800 mt-2 rounded-md shadow-md p-3 transition-all duration-300 ease-in-out transform origin-top scale-100">
              <li className="p-3 hover:bg-gray-700 rounded-md"><Link href="/room" className="flex items-center"><Package className="mr-2" size={16} /> Rooms</Link></li>
              <li className="p-3 hover:bg-gray-700 rounded-md"><Link href="/booking" className="flex items-center"><CalendarCheck className="mr-2" size={16} /> Booking</Link></li>
              <li className="p-3 hover:bg-gray-700 rounded-md"><Link href="/users" className="flex items-center"><Users className="mr-2" size={16} /> Users</Link></li>
            </ul>
          )}
        </li>
      </ul>
      <div className="relative">
        <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center space-x-2">
          <Image src="/profile.png" alt="User Avatar" width={32} height={32} className="rounded-full" />
          <div className="text-sm hover:text-blue-500 flex items-center">Teguh Afriansyah <ChevronDown size={16} className="ml-1" /></div>

        </button>
        {userMenuOpen && (
          <ul className="absolute right-0 bg-gray-800 mt-2 rounded-md shadow-md p-3 transition-all duration-300 ease-in-out transform origin-top scale-100">
            <li className="p-3 hover:bg-gray-700 rounded-md"><Link href="/profile" className="flex items-center"><User className="mr-2" size={16} /> Profile</Link></li>
            <li className="p-3 hover:bg-gray-700 rounded-md"><Link href="/logout" className="flex items-center"><LogOut className="mr-2" size={16} /> Logout</Link></li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;