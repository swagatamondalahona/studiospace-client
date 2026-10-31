
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, ArrowUpRight } from "lucide-react";

import API_URL from "@/lib/api";
import { Studio } from "@/types/studio";

export default function FeaturedStudios() {
    const [studios, setStudios] = useState<Studio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudios = async () => {
            try {
                const response = await fetch(`${API_URL}/api/studios/featured`);

                if (!response.ok) {
                    throw new Error("Failed to fetch studios");
                }

                const result = await response.json();
                setStudios(result.data);
            } catch (error) {
                console.error("Studio API Error:", error);
                setError("Unable to load studios. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudios();
    }, []);

    return (
        <section className="border-y border-[#d1e5d8] bg-[#e8f5ec] px-6 py-24 text-[#14251f] transition-colors duration-300 dark:border-[#263d32] dark:bg-[#0b0f0d] dark:text-white md:px-12 lg:px-20">
            <div className="mx-auto max-w-7xl">

                {/* Section Heading */}
                <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#166534] dark:text-[#34d399]">
                            Discover Your Space
                        </p>

                        <h2 className="text-3xl font-bold md:text-5xl">
                            Featured{" "}
                            <span className="text-[#166534] dark:text-[#34d399]">
                                Studios
                            </span>
                        </h2>

                        <p className="mt-4 max-w-xl text-[#52665b] dark:text-[#a7b9ae]">
                            Explore professional creative spaces designed to bring
                            your ideas to life.
                        </p>
                    </div>

                    <Link
                        href="/studios"
                        className="inline-flex items-center gap-2 font-semibold text-[#166534] transition hover:text-[#14532d] dark:text-[#34d399] dark:hover:text-[#6ee7b7]"
                    >
                        Explore All Studios
                        <ArrowUpRight size={20} />
                    </Link>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse overflow-hidden rounded-2xl border border-[#d1e5d8] bg-[#f7fdf8] shadow-sm dark:border-[#263d32] dark:bg-[#14251f]"
                            >
                                <div className="h-56 bg-[#d5e8da] dark:bg-[#263d32]" />

                                <div className="space-y-4 p-5">
                                    <div className="h-4 w-1/3 rounded bg-[#d5e8da] dark:bg-[#263d32]" />
                                    <div className="h-6 w-2/3 rounded bg-[#d5e8da] dark:bg-[#263d32]" />
                                    <div className="h-4 w-1/2 rounded bg-[#d5e8da] dark:bg-[#263d32]" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <p className="rounded-xl border border-red-300 bg-red-50 p-5 text-center text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                        {error}
                    </p>
                )}

                {/* Empty State */}
                {!loading && !error && studios.length === 0 && (
                    <p className="rounded-xl border border-[#d1e5d8] bg-[#f7fdf8] p-8 text-center text-[#52665b] dark:border-[#263d32] dark:bg-[#14251f] dark:text-[#a7b9ae]">
                        No studios available right now.
                    </p>
                )}

                {/* Studio Cards */}
                {!loading && !error && studios.length > 0 && (
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {studios.map((studio) => (
                            <article
                                key={studio._id}
                                className="group overflow-hidden rounded-2xl border border-[#d1e5d8] bg-[#f7fdf8] shadow-md shadow-emerald-950/5 transition duration-300 hover:-translate-y-2 hover:border-[#34d399] hover:shadow-xl hover:shadow-emerald-900/10 dark:border-[#263d32] dark:bg-[#14251f] dark:hover:border-[#34d399]/50 dark:hover:shadow-none"
                            >
                                {/* Studio Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={studio.image}
                                        alt={studio.name}
                                        fill
                                        unoptimized
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition duration-500 group-hover:scale-110"
                                    />

                                    <span className="absolute left-4 top-4 rounded-full border border-[#a7d8b8] bg-[#f0fdf4]/95 px-3 py-1 text-xs font-semibold text-[#14532d] shadow-sm backdrop-blur dark:border-[#34d399]/30 dark:bg-[#0b0f0d]/85 dark:text-[#a7f3d0]">
                                        {studio.category}
                                    </span>
                                </div>

                                {/* Studio Information */}
                                <div className="p-5">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <h3 className="text-xl font-bold text-[#14251f] transition group-hover:text-[#166534] dark:text-white dark:group-hover:text-[#34d399]">
                                            {studio.name}
                                        </h3>

                                        <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                                            <Star size={16} fill="currentColor" />
                                            {studio.rating.toFixed(1)}
                                        </div>
                                    </div>

                                    <div className="mb-5 flex items-center gap-2 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                        <MapPin
                                            size={16}
                                            className="shrink-0 text-[#166534] dark:text-[#34d399]"
                                        />
                                        {studio.location}
                                    </div>

                                    <div className="flex items-center justify-between border-t border-[#d1e5d8] pt-4 dark:border-[#263d32]">
                                        <p className="text-lg font-bold text-[#166534] dark:text-[#34d399]">
                                            ${studio.price}
                                            <span className="text-sm font-medium text-[#52665b] dark:text-[#a7b9ae]">
                                                /hr
                                            </span>
                                        </p>

                                        <Link
                                            href={`/studios/${studio._id}`}
                                            className="rounded-lg bg-[#166534] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#14532d] dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
