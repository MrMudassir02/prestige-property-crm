"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchProfile() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/user/profile", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      setUser(data.data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      setError(error.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#3f6f5f]" />

          <p className="mt-4 text-sm text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>

          <button
            onClick={fetchProfile}
            className="mt-5 rounded-xl bg-[#3f6f5f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#345f51]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main>
      {/* HEADER */}

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3f6f5f]">
          My Account
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#182033]">Profile</h1>

        <p className="mt-2 text-gray-500">Manage your account information.</p>
      </div>

      {/* PROFILE CARD */}

      <div className="mt-8 max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f0ed] text-xl font-bold text-[#3f6f5f]">
            {user?.email?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#182033]">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your registered account details
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {/* EMAIL */}

          <div>
            <p className="text-sm text-gray-500">Email Address</p>

            <p className="mt-1 font-medium text-[#182033]">{user?.email}</p>
          </div>

          {/* ROLE */}

          <div>
            <p className="text-sm text-gray-500">Account Type</p>

            <span className="mt-2 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold capitalize text-blue-600">
              {user?.role}
            </span>
          </div>

          {/* MEMBER SINCE */}

          <div>
            <p className="text-sm text-gray-500">Member Since</p>

            <p className="mt-1 font-medium text-[#182033]">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
