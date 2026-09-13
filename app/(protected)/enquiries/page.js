"use client";

import { useEffect, useState } from "react";

export default function UserEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchEnquiries() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/user/enquiries", {
       method : "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch enquiries");
      }

      setEnquiries(data.data || []);
    } catch (error) {
      console.error("Fetch enquiries error:", error);

      setError(error.message || "Unable to load enquiries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEnquiries();
  }, []);

  function getStatusStyle(status) {
    const styles = {
      new: "bg-blue-50 text-blue-600 border-blue-100",
      contacted: "bg-yellow-50 text-yellow-700 border-yellow-100",
      closed: "bg-green-50 text-green-700 border-green-100",
    };

    return (
      styles[status?.toLowerCase()] ||
      "bg-gray-50 text-gray-600 border-gray-200"
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#3f6f5f]" />

          <p className="mt-4 text-sm text-gray-500">
            Loading your enquiries...
          </p>
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
            onClick={fetchEnquiries}
            className="mt-5 rounded-xl bg-[#3f6f5f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#345f51]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3f6f5f]">
          My Property
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#182033]">My Enquiries</h1>

        <p className="mt-2 text-gray-500">
          Track all your property enquiries and their current status.
        </p>
      </div>

      {/* STATS */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Enquiries" value={enquiries.length} />

        <StatCard
          title="New"
          value={
            enquiries.filter(
              (enquiry) => enquiry.status?.toLowerCase() === "new"
            ).length
          }
          valueClass="text-blue-600"
        />

        <StatCard
          title="Contacted"
          value={
            enquiries.filter(
              (enquiry) => enquiry.status?.toLowerCase() === "contacted"
            ).length
          }
          valueClass="text-yellow-600"
        />

        <StatCard
          title="Closed"
          value={
            enquiries.filter(
              (enquiry) => enquiry.status?.toLowerCase() === "closed"
            ).length
          }
          valueClass="text-green-600"
        />
      </div>

      {/* EMPTY STATE */}
      {enquiries.length === 0 && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <h2 className="text-xl font-bold text-[#182033]">No enquiries yet</h2>

          <p className="mt-2 text-gray-500">
            You haven't submitted any property enquiries yet.
          </p>
        </div>
      )}

      {/* ENQUIRIES */}
      {enquiries.length > 0 && (
        <div className="mt-8 space-y-5">
          {enquiries.map((enquiry) => {
            const plot = enquiry.plot;
            const project = plot?.project;
            const city = project?.city;

            return (
              <div
                key={enquiry._id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* PROPERTY */}
                  <div>
                    <p className="text-sm text-gray-500">Property</p>

                    <h2 className="mt-1 text-xl font-bold text-[#182033]">
                      Plot {plot?.plotNumber || "N/A"}
                    </h2>

                    <p className="mt-1 text-gray-500">
                      {project?.name || "Property details unavailable"}
                    </p>
                  </div>

                  {/* LOCATION */}
                  <div>
                    <p className="text-sm text-gray-500">Location</p>

                    <p className="mt-2 font-medium text-[#182033]">
                      📍 {city?.name || "N/A"}
                    </p>

                    <p className="text-sm text-gray-500">{city?.state || ""}</p>
                  </div>

                  {/* STATUS */}
                  <div>
                    <p className="text-sm text-gray-500">Enquiry Status</p>

                    <span
                      className={`mt-2 inline-block rounded-full border px-4 py-1.5 text-sm font-semibold capitalize ${getStatusStyle(
                        enquiry.status
                      )}`}
                    >
                      {enquiry.status || "New"}
                    </span>
                  </div>

                  {/* DATE */}
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>

                    <p className="mt-2 font-medium text-[#182033]">
                      {new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* MESSAGE */}
                {enquiry.message && (
                  <div className="mt-6 border-t border-gray-100 pt-5">
                    <p className="text-sm font-semibold text-gray-700">
                      Your Message
                    </p>

                    <p className="mt-2 text-gray-500">{enquiry.message}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

function StatCard({ title, value, valueClass = "text-[#182033]" }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <p className={`mt-2 text-3xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}
