"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold text-[#3F6F5F]">
          Prestige Property
        </Link>

        {/* NAVIGATION */}
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-[#3f6f5f] transition"
          >
            Home
          </Link>

          <Link
            href="/properties"
            className="text-sm font-medium text-gray-600 hover:text-[#3f6f5f] transition"
          >
            Properties
          </Link>

          {/* AUTH LOADING */}
          {loading && <span className="text-sm text-gray-400">Loading...</span>}

          {/* NOT LOGGED IN */}
          {!loading && !user && (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-[#3f6f5f]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-[#3f6f5f] hover:bg-[#345f51] text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Register
              </Link>
            </>
          )}

          {/* NORMAL USER */}
          {!loading && user?.role === "user" && (
            <>
              <Link
                href="/user/dashboard"
                className="text-sm font-semibold text-[#3f6f5f] hover:text-[#345f51]"
              >
                My Account
              </Link>

              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Logout
              </button>
            </>
          )}

          {/* ADMIN */}
          {!loading && user?.role === "admin" && (
            <>
              <Link
                href="/admin/enquiries"
                className="text-sm font-semibold text-[#3f6f5f] hover:text-[#345f51]"
              >
                Admin Dashboard
              </Link>

              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
