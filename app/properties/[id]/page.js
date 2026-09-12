"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PropertyDetails() {
  const params = useParams();
  const id = params?.id;

  const [plot, setPlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (id) {
      fetchPlot();
    }
  }, [id]);

  async function fetchPlot() {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching property ID:", id);

      const response = await fetch(`/api/plots/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch property");
      }

      const data = await response.json();

      console.log("Property API response:", data);

      setPlot(data.data);
    } catch (error) {
      console.error("Property fetch error:", error);

      setError("Unable to load property details.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setFormError("");
      setSuccessMessage("");

      const response = await fetch("/api/enquiries", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...formData,
          plotId: plot._id,
        }),
      });

      const data = await response.json();

      console.log("Enquiry response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit enquiry");
      }

      setSuccessMessage("Your enquiry has been submitted successfully!");

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });

      setTimeout(() => {
        setShowForm(false);
        setSuccessMessage("");
      }, 2500);
    } catch (error) {
      console.error("Enquiry error:", error);

      setFormError(error.message || "Unable to submit enquiry.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f7f5]">
        <p className="text-gray-500">Loading property...</p>
      </main>
    );
  }

  if (error || !plot) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f5]">
        <p className="text-red-500">{error || "Property not found"}</p>

        <Link
          href="/"
          className="mt-5 px-5 py-3 bg-[#3f6f5f] text-white rounded-xl"
        >
          Back to Properties
        </Link>
      </main>
    );
  }

  const city = plot.project?.city;

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      {/* HEADER */}

      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-[#182033]">
            Prestige Property
          </Link>

          <Link href="/" className="text-sm font-semibold text-[#3f6f5f]">
            ← Back to Properties
          </Link>
        </div>
      </header>

      {/* PROPERTY DETAILS */}

      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT SIDE */}

          <div>
            {/* IMAGE */}

            <div className="h-[400px] rounded-3xl bg-gradient-to-br from-[#e8f0ec] to-[#d6e2dc] flex items-center justify-center">
              <span className="text-8xl">🏡</span>
            </div>

            {/* LOCATION CARD */}

            <div className="mt-5 bg-white border border-gray-200 rounded-2xl p-6">
              <div>
                <p className="text-sm text-gray-500">Property Location</p>

                <p className="mt-2 font-semibold text-[#182033]">
                  📍 {city?.name}, {city?.state}
                </p>
              </div>

              <div className="mt-5 border-t border-gray-100 pt-5">
                <p className="text-sm text-gray-500">Project</p>

                <p className="mt-2 font-semibold text-[#182033]">
                  🏗️ {plot.project?.name}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div>
            {/* TITLE */}

            <div className="flex justify-between items-start gap-5">
              <div>
                <p className="text-sm font-semibold tracking-wider uppercase text-[#3f6f5f]">
                  {plot.project?.name}
                </p>

                <h1 className="mt-3 text-4xl md:text-5xl font-bold text-[#182033]">
                  Plot {plot.plotNumber}
                </h1>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize

                ${
                  plot.status === "available"
                    ? "bg-green-100 text-green-700"
                    : plot.status === "hold"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }
                `}
              >
                {plot.status}
              </span>
            </div>

            {/* LOCATION */}

            <div className="mt-8">
              <p className="text-gray-500">Location</p>

              <p className="mt-2 text-lg font-semibold text-[#273142]">
                📍 {city?.name}, {city?.state}
              </p>
            </div>

            {/* PRICE */}

            <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6">
              <p className="text-sm text-gray-500">Property Price</p>

              <p className="mt-2 text-3xl font-bold text-[#3f6f5f]">
                ₹ {Number(plot.price).toLocaleString("en-IN")}
              </p>
            </div>

            {/* PROPERTY INFO */}

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <p className="text-sm text-gray-500">Plot Size</p>

                <p className="mt-2 text-lg font-bold text-[#182033]">
                  📐 {plot.size} {plot.unit}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <p className="text-sm text-gray-500">Facing</p>

                <p className="mt-2 text-lg font-bold text-[#182033]">
                  🧭 {plot.facing}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <p className="text-sm text-gray-500">Project</p>

                <p className="mt-2 text-lg font-bold text-[#182033]">
                  {plot.project?.name}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <p className="text-sm text-gray-500">Status</p>

                <p className="mt-2 text-lg font-bold text-[#182033] capitalize">
                  {plot.status}
                </p>
              </div>
            </div>

            {/* ENQUIRY BUTTON */}

            <button
              onClick={() => {
                setShowForm(true);
                setFormError("");
                setSuccessMessage("");
              }}
              className="mt-8 w-full bg-[#3f6f5f] hover:bg-[#345f51] text-white py-4 rounded-xl font-semibold text-lg transition"
            >
              Enquire About This Property
            </button>

            <p className="mt-3 text-center text-sm text-gray-500">
              Our property team will contact you shortly.
            </p>
          </div>
        </div>
      </section>

      {/* ENQUIRY MODAL */}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            {/* MODAL HEADER */}

            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-[#3f6f5f]">
                  PROPERTY ENQUIRY
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#182033]">
                  Interested in Plot {plot.plotNumber}?
                </h2>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="text-2xl text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            {/* SUCCESS */}

            {successMessage && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-700">{successMessage}</p>
              </div>
            )}

            {/* ERROR */}

            {formError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600">{formError}</p>
              </div>
            )}

            {/* FORM */}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* NAME */}

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Full Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#3f6f5f]"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Phone Number *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#3f6f5f]"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#3f6f5f]"
                />
              </div>

              {/* MESSAGE */}

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Message
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you would like to know..."
                  rows="4"
                  className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#3f6f5f] resize-none"
                />
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#3f6f5f] hover:bg-[#345f51] disabled:opacity-60 text-white py-4 rounded-xl font-semibold transition"
              >
                {submitting ? "Submitting Enquiry..." : "Submit Enquiry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
