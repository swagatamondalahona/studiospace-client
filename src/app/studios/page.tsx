"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Search, SlidersHorizontal, ArrowUpRight } from "lucide-react";

import API_URL from "@/lib/api";
import { Studio } from "@/types/studio";

const categories = [
    "All",
    "Photo Studios",
    "Sound Stages",
    "Podcast Rooms",
    "Music Suites",
    "Art Workshops",
];

function StudiosList() {
    const searchParams = useSearchParams();
    const queryCategory = searchParams.get("category");

    const [studios, setStudios] = useState<Studio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<string>("All");

    // Sync category when query param changes
    useEffect(() => {
        if (queryCategory && categories.includes(queryCategory)) {
            setCategory(queryCategory);
        } else if (!queryCategory) {
            setCategory("All");
        }
    }, [queryCategory]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchStudios = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/api/studios`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch studios.");
                }

                const result = await response.json();
                setStudios(result.data || []);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") {
                    return;
                }

                console.error("Explore Studios Error:", err);
                setError("Unable to load studios. Please try again later.");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchStudios();

        return () => controller.abort();
    }, []);

    const filteredStudios = useMemo(() => {
        return studios.filter((studio) => {
            const matchesCategory =
                category === "All" || studio.category === category;

            const searchText = search.toLowerCase().trim();

            const matchesSearch =
                studio.name.toLowerCase().includes(searchText) ||
                studio.location.toLowerCase().includes(searchText) ||
                studio.category.toLowerCase().includes(searchText);

            return matchesCategory && matchesSearch;
        });
    }, [studios, category, search]);

    return (
        <section className="min-h-screen bg-[#f7fdf8] px-5 py-16 text-[#14251f] transition-colors dark:bg-[#0b0f0d] dark:text-white md:px-10 lg:px-20">
            <div className="mx-auto max-w-7xl">

                {/* Page Heading */}
                <div className="mb-12 text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#166534] dark:text-[#34d399]">
                        Find Your Perfect Space
                    </p>

                    <h1 className="text-4xl font-bold md:text-5xl">
                        Explore Creative{" "}
                        <span className="text-[#166534] dark:text-[#34d399]">
                            Studios
                        </span>
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-[#52665b] dark:text-[#a7b9ae]">
                        Discover professional photography, music, podcast and
                        production spaces for your next creative project.
                    </p>
                </div>

                {/* Search */}
                <div className="mb-7 flex flex-col gap-4 md:flex-row">
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#648071]"
                            size={20}
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by studio name, location or category..."
                            className="w-full rounded-xl border border-[#d1e5d8] bg-white py-4 pl-12 pr-4 outline-none transition focus:border-[#34d399] dark:border-[#263d32] dark:bg-[#14251f]"
                        />
                    </div>
                </div>

                {/* Category Filters */}
                <div className="mb-10 flex flex-wrap items-center gap-3">
                    <SlidersHorizontal
                        size={19}
                        className="text-[#166534] dark:text-[#34d399]"
                    />

                    {categories.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setCategory(item)}
                            className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${category === item
                                    ? "border-[#166534] bg-[#166534] text-white dark:border-[#34d399] dark:bg-[#34d399] dark:text-[#0b0f0d]"
                                    : "border-[#d1e5d8] bg-white text-[#52665b] hover:border-[#34d399] dark:border-[#263d32] dark:bg-[#14251f] dark:text-[#a7b9ae]"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Results Count */}
                {!loading && !error && (
                    <p className="mb-6 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                        Showing {filteredStudios.length} of {studios.length} studios
                    </p>
                )}

                {/* Loading Skeleton */}
                {loading && (
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse overflow-hidden rounded-2xl border border-[#d1e5d8] dark:border-[#263d32]"
                            >
                                <div className="h-56 bg-[#d5e8da] dark:bg-[#263d32]" />
                                <div className="space-y-4 p-5">
                                    <div className="h-5 w-2/3 rounded bg-[#d5e8da] dark:bg-[#263d32]" />
                                    <div className="h-4 w-1/2 rounded bg-[#d5e8da] dark:bg-[#263d32]" />
                                    <div className="h-8 rounded bg-[#d5e8da] dark:bg-[#263d32]" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-xl border border-red-300 bg-red-50 p-8 text-center text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                        {error}
                    </div>
                )}

                {/* Studio Cards */}
                {!loading && !error && filteredStudios.length > 0 && (
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredStudios.map((studio) => (
                            <article
                                key={studio._id}
                                className="group overflow-hidden rounded-2xl border border-[#d1e5d8] bg-white shadow-md shadow-emerald-950/5 transition duration-300 hover:-translate-y-2 hover:border-[#34d399] hover:shadow-xl dark:border-[#263d32] dark:bg-[#14251f]"
                            >
                                {/* Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={studio.image}
                                        alt={studio.name}
                                        fill
                                        unoptimized
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition duration-500 group-hover:scale-110"
                                    />

                                    <span className="absolute left-4 top-4 rounded-full border border-[#a7d8b8] bg-[#f0fdf4]/95 px-3 py-1 text-xs font-semibold text-[#14532d] dark:border-[#34d399]/30 dark:bg-[#0b0f0d]/90 dark:text-[#a7f3d0]">
                                        {studio.category}
                                    </span>
                                </div>

                                {/* Information */}
                                <div className="p-5">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <h2 className="text-xl font-bold">
                                            {studio.name}
                                        </h2>

                                        <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                                            <Star size={16} fill="currentColor" />
                                            {(studio.rating ?? 0).toFixed(1)}
                                        </span>
                                    </div>

                                    <p className="mb-4 flex items-center gap-2 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                        <MapPin size={16} className="shrink-0 text-[#166534] dark:text-[#34d399]" />
                                        {studio.location}
                                    </p>

                                    <p className="mb-5 line-clamp-2 min-h-10 text-sm leading-6 text-[#52665b] dark:text-[#a7b9ae]">
                                        {studio.description}
                                    </p>

                                    <div className="flex items-center justify-between border-t border-[#d1e5d8] pt-4 dark:border-[#263d32]">
                                        <p className="text-xl font-bold text-[#166534] dark:text-[#34d399]">
                                            ${studio.price}
                                            <span className="text-sm font-medium text-[#52665b] dark:text-[#a7b9ae]">
                                                /hr
                                            </span>
                                        </p>

                                        <Link
                                            href={`/studios/${studio._id}`}
                                            className="inline-flex items-center gap-2 rounded-lg bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532d] dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                                        >
                                            View Details
                                            <ArrowUpRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredStudios.length === 0 && (
                    <div className="rounded-2xl border border-[#d1e5d8] bg-white px-6 py-16 text-center dark:border-[#263d32] dark:bg-[#14251f]">
                        <Search
                            size={38}
                            className="mx-auto mb-4 text-[#166534] dark:text-[#34d399]"
                        />

                        <h2 className="text-2xl font-bold">
                            No Studios Found
                        </h2>

                        <p className="mt-3 text-[#52665b] dark:text-[#a7b9ae]">
                            Try another search or select a different category.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setCategory("All");
                            }}
                            className="mt-6 rounded-lg bg-[#166534] px-6 py-3 font-semibold text-white transition hover:bg-[#14532d] dark:bg-[#34d399] dark:text-[#0b0f0d]"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default function StudiosPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#166534] border-t-transparent dark:border-[#34d399] dark:border-t-transparent" />
                </div>
            }
        >
            <StudiosList />
        </Suspense>
    );
}
