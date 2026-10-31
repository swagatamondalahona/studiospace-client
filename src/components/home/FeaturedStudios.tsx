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
        <section className="bg-[#070B14] px-6 py-24 text-white">
            <div className="mx-auto max-w-7xl">

                {/* Section Heading */}
                <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                            Discover Your Space
                        </p>

                        <h2 className="text-3xl font-bold md:text-5xl">
                            Featured <span className="text-blue-500">Studios</span>
                        </h2>

                        <p className="mt-4 max-w-xl text-gray-400">
                            Explore professional creative spaces designed to bring
                            your ideas to life.
                        </p>
                    </div>

                    <Link
                        href="/studios"
                        className="inline-flex items-center gap-2 font-semibold text-blue-400 transition hover:text-blue-300"
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
                                className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                            >
                                <div className="h-56 bg-white/10" />
                                <div className="space-y-4 p-5">
                                    <div className="h-4 w-1/3 rounded bg-white/10" />
                                    <div className="h-6 w-2/3 rounded bg-white/10" />
                                    <div className="h-4 w-1/2 rounded bg-white/10" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-center text-red-300">
                        {error}
                    </p>
                )}

                {/* Empty State */}
                {!loading && !error && studios.length === 0 && (
                    <p className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-gray-400">
                        No studios available right now.
                    </p>
                )}

                {/* Studio Cards */}
                {!loading && !error && studios.length > 0 && (
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {studios.map((studio) => (
                            <article
                                key={studio._id}
                                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0D1422] transition duration-300 hover:-translate-y-2 hover:border-blue-500/50"
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

                                    <span className="absolute left-4 top-4 rounded-full border border-blue-400/30 bg-[#070B14]/80 px-3 py-1 text-xs font-medium text-blue-300 backdrop-blur">
                                        {studio.category}
                                    </span>
                                </div>

                                {/* Studio Information */}
                                <div className="p-5">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <h3 className="text-xl font-bold transition group-hover:text-blue-400">
                                            {studio.name}
                                        </h3>

                                        <div className="flex shrink-0 items-center gap-1 text-sm text-yellow-400">
                                            <Star size={16} fill="currentColor" />
                                            {studio.rating.toFixed(1)}
                                        </div>
                                    </div>

                                    <div className="mb-5 flex items-center gap-2 text-sm text-gray-400">
                                        <MapPin size={16} className="text-blue-400" />
                                        {studio.location}
                                    </div>

                                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                        <p className="text-lg font-bold text-blue-400">
                                            ${studio.price}
                                            <span className="text-sm font-normal text-gray-400">
                                                /hr
                                            </span>
                                        </p>

                                        <Link
                                            href={`/studios/${studio._id}`}
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
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