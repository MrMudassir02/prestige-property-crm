"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/user/enquiries");

        const data = await response.json();

        if (response.ok) {
          setEnquiries(data.data || []);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const totalEnquiries = enquiries.length;

  const newEnquiries = enquiries.filter(
    (enquiry) => enquiry.status?.toLowerCase() === "new"
  ).length;

  const contactedEnquiries = enquiries.filter(
    (enquiry) => enquiry.status?.toLowerCase() === "contacted"
  ).length;

  const closedEnquiries = enquiries.filter(
    (enquiry) => enquiry.status?.toLowerCase() === "closed"
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#3f6f5f]" />

          <p className="mt-4 text-gray-500">Loading dashboard...</p>
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

        <h1 className="mt-2 text-3xl font-bold text-[#182033]">Dashboard</h1>

        <p className="mt-2 text-gray-500">
          Manage your property enquiries and account activity.
        </p>
      </div>

      {/* STATS */}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Enquiries" value={totalEnquiries} />

        <StatCard title="New" value={newEnquiries} valueClass="text-blue-600" />

        <StatCard
          title="Contacted"
          value={contactedEnquiries}
          valueClass="text-yellow-600"
        />

        <StatCard
          title="Closed"
          value={closedEnquiries}
          valueClass="text-green-600"
        />
      </div>

      {/* QUICK ACTION */}

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#182033]">
              Your Property Enquiries
            </h2>

            <p className="mt-2 text-gray-500">
              View all your enquiries and track their latest status.
            </p>
          </div>

          <Link
            href="/enquiries"
            className="inline-flex items-center justify-center rounded-xl bg-[#3f6f5f] px-5 py-3 font-semibold text-white transition hover:bg-[#345f51]"
          >
            View Enquiries
          </Link>
        </div>
      </div>

      {/* RECENT ENQUIRIES */}

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#182033]">
              Recent Enquiries
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your latest property enquiries.
            </p>
          </div>

          {enquiries.length > 0 && (
            <Link
              href="/enquiries"
              className="text-sm font-semibold text-[#3f6f5f] hover:underline"
            >
              View all
            </Link>
          )}
        </div>

        {enquiries.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <h3 className="text-lg font-semibold text-[#182033]">
              No enquiries yet
            </h3>

            <p className="mt-2 text-gray-500">
              Start exploring properties and submit an enquiry.
            </p>

            <Link
              href="/properties"
              className="mt-5 inline-flex rounded-xl bg-[#3f6f5f] px-5 py-3 text-sm font-semibold text-white"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {enquiries.slice(0, 3).map((enquiry) => {
              const plot = enquiry.plot;
              const project = plot?.project;

              return (
                <div
                  key={enquiry._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-bold text-[#182033]">
                        {plot?.plotNumber
                          ? `Plot ${plot.plotNumber}`
                          : "Property"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {project?.name || "Project unavailable"}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${getStatusStyle(
                        enquiry.status
                      )}`}
                    >
                      {enquiry.status || "New"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
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

function getStatusStyle(status) {
  const styles = {
    new: "bg-blue-50 text-blue-600",

    contacted: "bg-yellow-50 text-yellow-700",

    closed: "bg-green-50 text-green-700",
  };

  return styles[status?.toLowerCase()] || "bg-gray-100 text-gray-600";
}
