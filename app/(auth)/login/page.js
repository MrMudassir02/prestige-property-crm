"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Redirect based on user role
      if (data.user.role === "admin") {
        router.replace("/admin/enquiries");
      } else {
        router.replace("/");
      }

      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#3f6f5f]">
            Prestige Property
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#182033]">
            Welcome back
          </h1>

          <p className="mt-2 text-gray-500">Login to access your account.</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700">Email</label>

            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#3f6f5f]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#3f6f5f]"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3f6f5f] hover:bg-[#345f51] disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-00">
          Don't have and account?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="font-semibold text[#3f6f5f] hover:underline"
          >
            Create account
          </button>
        </p>
      </div>
    </main>
  );
}
