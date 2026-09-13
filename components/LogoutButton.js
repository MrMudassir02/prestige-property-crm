"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="
        bg-[#182033]
        hover:bg-[#3f6f5f]
        disabled:opacity-60
        disabled:cursor-not-allowed
        text-white
        px-5
        py-2.5
        rounded-xl
        text-sm
        font-semibold
        transition
        duration-200
      "
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
