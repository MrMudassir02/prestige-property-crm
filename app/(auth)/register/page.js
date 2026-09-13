"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(event) {
    event.preventDefault();

    setError("");

    // CLIENT VALIDATION

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
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
        throw new Error(data.message || "Registration failed");
      }

      // ACCOUNT CREATED
      // REDIRECT TO LOGIN

      router.push("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        {/* HEADER */}

        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#3f6f5f]">
            Prestige Property
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#182033]">
            Create account
          </h1>

          <p className="mt-2 text-gray-500">
            Create an account to manage your property enquiries.
          </p>
        </div>

        {/* FORM */}

        <form onSubmit={handleRegister} className="mt-8 space-y-5">
          {/* EMAIL */}

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

          {/* PASSWORD */}

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#3f6f5f]"
            />
          </div>

          {/* CONFIRM PASSWORD */}

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Confirm Password
            </label>

            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm your password"
              className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#3f6f5f]"
            />
          </div>

          {/* ERROR */}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3f6f5f] hover:bg-[#345f51] disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* LOGIN LINK */}

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="font-semibold text-[#3f6f5f] hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </main>
  );
}
