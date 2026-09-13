"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import UserMenu from "@/components/UserMenu";

export default function PublicNavbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold text-[#182033]">
          Prestige Property
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="transition hover:text-[#3f6f5f]">
            Home
          </Link>

          <Link href="/properties" className="transition hover:text-[#3f6f5f]">
            Properties
          </Link>

          {!loading && (
            <>
              {user ? (
                <UserMenu user={user} />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="transition hover:text-[#3f6f5f]"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-xl bg-[#3f6f5f] px-5 py-3 text-white transition hover:bg-[#345f51]"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
