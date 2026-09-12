"use client";

import { useEffect, useState } from "react";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/enquiries");

      if (!response.ok) {
        throw new Error("Failed to fetch enquiries");
      }

      const data = await response.json();

      console.log("Admin enquiries:", data);

      setEnquiries(data.data || []);
    } catch (error) {
      console.error("Enquiries fetch error:", error);
      setError("Unable to load enquiries.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(enquiryId, status) {
    try {
      setUpdatingId(enquiryId);

      const response = await fetch(`/api/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      console.log("Status update response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setEnquiries((currentEnquiries) =>
        currentEnquiries.map((enquiry) =>
          enquiry._id === enquiryId
            ? {
                ...enquiry,
                status: data.data.status,
              }
            : enquiry
        )
      );
    } catch (error) {
      console.error("Status update error:", error);

      alert(error.message || "Unable to update enquiry status");
    } finally {
      setUpdatingId("");
    }
  }

  function getStatusStyle(status) {
    if (status === "new") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }

    if (status === "contacted") {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }

    if (status === "closed") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    return "bg-gray-100 text-gray-700 border-gray-200";
  }

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const searchTerm = search.toLowerCase();

    const customerName = enquiry.customer?.name?.toLowerCase() || "";

    const phone = enquiry.customer?.phone?.toLowerCase() || "";

    const email = enquiry.customer?.email?.toLowerCase() || "";

    const plotNumber = enquiry.plot?.plotNumber?.toLowerCase() || "";

    const projectName = enquiry.plot?.project?.name?.toLowerCase() || "";

    const matchesSearch =
      customerName.includes(searchTerm) ||
      phone.includes(searchTerm) ||
      email.includes(searchTerm) ||
      plotNumber.includes(searchTerm) ||
      projectName.includes(searchTerm);

    const matchesStatus =
      selectedStatus === "all" || enquiry.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const totalEnquiries = enquiries.length;

  const newEnquiries = enquiries.filter(
    (enquiry) => enquiry.status === "new"
  ).length;

  const contactedEnquiries = enquiries.filter(
    (enquiry) => enquiry.status === "contacted"
  ).length;

  const closedEnquiries = enquiries.filter(
    (enquiry) => enquiry.status === "closed"
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-500">
            Loading enquiries...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] flex flex-col items-center justify-center">
        <p className="text-red-500">{error}</p>

        <button
          onClick={fetchEnquiries}
          className="mt-5 px-5 py-3 bg-[#3f6f5f] text-white rounded-xl"
        >
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      {/* HEADER */}

      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#3f6f5f]">
            Admin Panel
          </p>

          <div className="mt-2 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#182033]">
                Enquiries Management
              </h1>

              <p className="mt-2 text-gray-500">
                Manage customer property enquiries.
              </p>
            </div>

            <button
              onClick={fetchEnquiries}
              className="px-5 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-[#3f6f5f] transition"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-10">
        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-500">Total Enquiries</p>

            <p className="mt-2 text-3xl font-bold text-[#182033]">
              {totalEnquiries}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-500">New</p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {newEnquiries}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-500">Contacted</p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {contactedEnquiries}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-500">Closed</p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {closedEnquiries}
            </p>
          </div>
        </div>

        {/* SEARCH + FILTER */}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* SEARCH */}

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer, phone, email, plot or project..."
              className="flex-1 px-5 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#3f6f5f]"
            />

            {/* STATUS FILTER */}

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="px-5 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#3f6f5f]"
            >
              <option value="all">All Statuses</option>

              <option value="new">New</option>

              <option value="contacted">Contacted</option>

              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* RESULTS INFO */}

        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Showing {filteredEnquiries.length} of {enquiries.length} enquiries
          </p>
        </div>

        {/* EMPTY STATE */}

        {filteredEnquiries.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
            <p className="text-gray-500">No enquiries found.</p>
          </div>
        )}

        {/* TABLE */}

        {filteredEnquiries.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1100px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Property
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Location
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Message
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEnquiries.map((enquiry) => (
                    <tr
                      key={enquiry._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      {/* CUSTOMER */}

                      <td className="px-6 py-5">
                        <p className="font-semibold text-[#182033]">
                          {enquiry.customer?.name || "Unknown"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {enquiry.customer?.email || "No email"}
                        </p>
                      </td>

                      {/* CONTACT */}

                      <td className="px-6 py-5">
                        <p className="text-gray-700 whitespace-nowrap">
                          📞 {enquiry.customer?.phone || "-"}
                        </p>
                      </td>

                      {/* PROPERTY */}

                      <td className="px-6 py-5">
                        <p className="font-semibold text-[#182033]">
                          Plot {enquiry.plot?.plotNumber || "-"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {enquiry.plot?.project?.name || "-"}
                        </p>
                      </td>

                      {/* LOCATION */}

                      <td className="px-6 py-5">
                        <p className="text-gray-700">
                          📍 {enquiry.plot?.project?.city?.name || "-"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {enquiry.plot?.project?.city?.state || ""}
                        </p>
                      </td>

                      {/* MESSAGE */}

                      <td className="px-6 py-5 max-w-[220px]">
                        <p className="text-sm text-gray-600 truncate">
                          {enquiry.message || "No message"}
                        </p>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`w-fit px-3 py-1 rounded-full border text-xs font-semibold capitalize ${getStatusStyle(
                              enquiry.status
                            )}`}
                          >
                            {enquiry.status}
                          </span>

                          <select
                            value={enquiry.status}
                            disabled={updatingId === enquiry._id}
                            onChange={(event) =>
                              updateStatus(enquiry._id, event.target.value)
                            }
                            className="px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white outline-none focus:border-[#3f6f5f] disabled:opacity-50"
                          >
                            <option value="new">New</option>

                            <option value="contacted">Contacted</option>

                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </td>

                      {/* DATE */}

                      <td className="px-6 py-5">
                        <p className="text-sm text-gray-600 whitespace-nowrap">
                          {enquiry.createdAt
                            ? new Date(enquiry.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
