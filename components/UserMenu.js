"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Logout failed");
      }

      setOpen(false);

      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      alert("Unable to logout. Please try again.");
    }
  }

  if (!user) {
    return null;
  }

  const initial = user.email?.charAt(0).toUpperCase() || "U";

  return (
    <div ref={menuRef} className="relative">
      {/* PROFILE BUTTON */}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-gray-100"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3f6f5f] text-sm font-bold text-white">
          {initial}
        </div>

        <span className="hidden text-sm font-medium text-[#182033] md:block">
          {user.email}
        </span>

        <span className="text-xs text-gray-500">▼</span>
      </button>

      {/* DROPDOWN */}

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          {/* USER INFO */}

          <div className="border-b border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3f6f5f] font-bold text-white">
                {initial}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#182033]">
                  {user.email}
                </p>

                <p className="mt-1 text-xs capitalize text-gray-500">
                  {user.role} Account
                </p>
              </div>
            </div>
          </div>

          {/* USER LINKS */}

          <div className="p-2">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              👤 My Profile
            </Link>

            {/* ONLY NORMAL USER */}

            {user.role === "user" && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  📊 Dashboard
                </Link>

                <Link
                  href="/enquiries"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  📋 My Enquiries
                </Link>
              </>
            )}

            {/* ADMIN */}

            {user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-[#3f6f5f] transition hover:bg-green-50"
              >
                ⚙️ Admin Panel
              </Link>
            )}
          </div>

          {/* LOGOUT */}

          <div className="border-t border-gray-100 p-2">
            <button
              onClick={handleLogout}
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
