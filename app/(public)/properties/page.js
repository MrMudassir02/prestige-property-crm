"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PropertiesPage() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlots() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/plots");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch properties");
        }

        setPlots(data.plots || []);
      } catch (error) {
        console.error("Fetch properties error:", error);

        setError(error.message || "Unable to load properties");
      } finally {
        setLoading(false);
      }
    }

    fetchPlots();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10">
        <p className="text-gray-500">Loading properties...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-6 py-10">
        <h1 className="text-2xl font-bold text-red-500">
          Unable to load properties
        </h1>

        <p className="mt-3 text-gray-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-[#182033]">
          Available Properties
        </h1>

        <p className="mt-3 text-gray-500">
          Browse available plots across our projects.
        </p>

        {plots.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-[#182033]">
              No properties available
            </h2>

            <p className="mt-3 text-gray-500">
              Please check back later for available properties.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plots.map((plot) => {
              const project = plot.project;
              const city = project?.city;

              return (
                <div
                  key={plot._id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Plot</p>

                      <h2 className="mt-1 text-xl font-bold text-[#182033]">
                        Plot {plot.plotNumber}
                      </h2>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        plot.status === "available"
                          ? "bg-green-100 text-green-700"
                          : plot.status === "hold"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {plot.status}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Project</p>

                      <p className="font-medium text-[#182033]">
                        {project?.name || "Project unavailable"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">City</p>

                      <p className="font-medium text-[#182033]">
                        {city?.name || "Location unavailable"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Facing</p>

                      <p className="font-medium text-[#182033]">
                        {plot.facing}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Price</p>

                      <p className="font-bold text-[#3f6f5f]">
                        ₹{plot.price?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/properties/${plot._id}`}
                    className="mt-6 block rounded-xl bg-[#3f6f5f] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#345f51]"
                  >
                    View Property
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
