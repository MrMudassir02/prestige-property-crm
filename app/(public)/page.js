"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [plots, setPlots] = useState([]);

  const [selectedCity, setSelectedCity] = useState("All Cities");

  const [selectedProject, setSelectedProject] = useState("All Projects");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlots();
  }, []);

  async function fetchPlots() {
    try {
      setLoading(true);

      setError("");

      const response = await fetch("/api/plots");

      if (!response.ok) {
        throw new Error("Failed to fetch plots");
      }

      const data = await response.json();

      console.log("Public plots:", data);

      setPlots(data.plots || []);
    } catch (error) {
      console.error("Fetch plots error:", error);

      setError("Unable to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // UNIQUE CITIES

  const cities = [
    ...new Set(plots.map((plot) => plot.project?.city?.name).filter(Boolean)),
  ];

  // PROJECTS BASED ON SELECTED CITY

  const projects = [
    ...new Set(
      plots
        .filter((plot) => {
          if (selectedCity === "All Cities") {
            return true;
          }

          return plot.project?.city?.name === selectedCity;
        })
        .map((plot) => plot.project?.name)
        .filter(Boolean)
    ),
  ];

  // FINAL FILTERED PLOTS

  const filteredPlots = plots.filter((plot) => {
    const cityName = plot.project?.city?.name;

    const projectName = plot.project?.name;

    const cityMatches =
      selectedCity === "All Cities" || cityName === selectedCity;

    const projectMatches =
      selectedProject === "All Projects" || projectName === selectedProject;

    return cityMatches && projectMatches;
  });

  function handleCityChange(city) {
    setSelectedCity(city);

    // Reset project when city changes

    setSelectedProject("All Projects");
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      {/* HERO */}

      <section className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <p className="text-s font-bold tracking-[0.15em] text-[#3F6F5F] uppercase">
            Prestige Property
          </p>

          <h1 className="mt-5 text-5xl md:text-7xl font-bold tracking-tight text-[#182033]">
            Find your ideal plot.
          </h1>

          <p className="mt-5 text-lg text-gray-600 max-w-xl">
            Browse available plots across premium projects and locations.
          </p>
        </div>
      </section>

      {/* PROPERTIES */}

      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#273142]">
            Available Properties
          </h2>

          <p className="mt-2 text-gray-600">
            Search plots by city and project.
          </p>
        </div>

        {/* CITY FILTER */}

        <div className="mt-8">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Select City
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCityChange("All Cities")}
              className={`px-5 py-3 rounded-full text-sm font-semibold transition ${
                selectedCity === "All Cities"
                  ? "bg-[#3f6f5f] text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-[#3f6f5f]"
              }`}
            >
              All Cities
            </button>

            {cities.map((city) => (
              <button
                key={city}
                onClick={() => handleCityChange(city)}
                className={`px-5 py-3 rounded-full text-sm font-semibold transition ${
                  selectedCity === city
                    ? "bg-[#3f6f5f] text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-[#3f6f5f]"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* PROJECT FILTER */}

        <div className="mt-8">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Select Project
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedProject("All Projects")}
              className={`px-5 py-3 rounded-full text-sm font-semibold transition ${
                selectedProject === "All Projects"
                  ? "bg-[#182033] text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-[#182033]"
              }`}
            >
              All Projects
            </button>

            {projects.map((project) => (
              <button
                key={project}
                onClick={() => setSelectedProject(project)}
                className={`px-5 py-3 rounded-full text-sm font-semibold transition ${
                  selectedProject === project
                    ? "bg-[#182033] text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-[#182033]"
                }`}
              >
                {project}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-8">
            <p className="text-gray-500">Loading available properties...</p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* NO PROPERTIES */}

        {!loading && !error && filteredPlots.length === 0 && (
          <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-8">
            <p className="text-gray-600">No plots found for this selection.</p>
          </div>
        )}

        {/* PLOT GRID */}

        {!loading && !error && filteredPlots.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredPlots.map((plot) => (
              <div
                key={plot._id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-52 bg-gradient-to-br from-[#e8f0ec] to-[#d6e2dc] flex items-center justify-center">
                  <span className="text-5xl">🏡</span>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#182033]">
                        Plot {plot.plotNumber}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {plot.project?.name}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        plot.status === "available"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {plot.status}
                    </span>
                  </div>

                  <p className="mt-5 text-gray-600">
                    📍 {plot.project?.city?.name}, {plot.project?.city?.state}
                  </p>

                  <p className="mt-3 text-gray-600">
                    📐 {plot.size} {plot.unit}
                  </p>

                  <p className="mt-3 text-gray-600">🧭 Facing: {plot.facing}</p>

                  <p className="mt-5 text-2xl font-bold text-[#3f6f5f]">
                    ₹ {Number(plot.price).toLocaleString("en-IN")}
                  </p>
                  <Link
                    href={`/properties/${plot._id}`}
                    className="mt-6 w-full bg-[#3f6f5f] text-white py-3 rounded-xl font-semibold hover:bg-[#345f51] transition text-center block"
                  >
                    View Property
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
