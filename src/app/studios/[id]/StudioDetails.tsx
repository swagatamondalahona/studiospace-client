
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Studio {
    _id: string;
    name: string;
    image: string;
    category: string;
    price: number;
    rating: number;
    location: string;
    description: string;
    securityDeposit: number;
    maxCapacity: number;
    amenities: string[];
    ownerName: string;
    ownerEmail: string;
}

export default function StudioDetails() {
    const params = useParams();
    const id = params.id as string;

    const [studio, setStudio] = useState<Studio | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const controller = new AbortController();

        const fetchStudio = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/studios/${id}`,
                    {
                        credentials: "include",
                        signal: controller.signal,
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to load studio details."
                    );
                }

                setStudio(result.data);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") {
                    return;
                }

                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchStudio();

        return () => controller.abort();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-700 border-t-transparent" />
            </div>
        );
    }

    if (error || !studio) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
                <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">
                    Studio Not Found
                </h2>

                <p className="mt-3 text-gray-600 dark:text-gray-400">
                    {error || "This studio could not be found."}
                </p>

                <Link
                    href="/studios"
                    className="mt-6 rounded-lg bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                    Explore Studios
                </Link>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-[#dcebe0] px-4 py-10 text-[#18352a] dark:bg-[#0b0f0d] dark:text-white">
            <div className="mx-auto max-w-6xl">

                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                    <Link href="/" className="hover:text-green-700">
                        Home
                    </Link>
                    {" / "}
                    <Link href="/studios" className="hover:text-green-700">
                        Explore Studios
                    </Link>
                    {" / "}
                    <span>{studio.name}</span>
                </div>

                {/* Studio Image */}
                <div className="relative h-[280px] overflow-hidden rounded-2xl sm:h-[420px]">
                    <Image
                        src={studio.image}
                        alt={studio.name}
                        fill
                        priority
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 1200px"
                    />

                    <span className="absolute left-5 top-5 rounded-full bg-green-800 px-4 py-2 text-sm font-semibold text-white">
                        {studio.category}
                    </span>
                </div>

                {/* Main Content */}
                <div className="mt-8 grid gap-8 lg:grid-cols-3">

                    {/* Studio Information */}
                    <div className="space-y-7 lg:col-span-2">

                        <div>
                            <h1 className="text-3xl font-bold sm:text-4xl">
                                {studio.name}
                            </h1>

                            <p className="mt-3 text-[#52665b] dark:text-[#a7b9ae]">
                                📍 {studio.location}
                            </p>

                            <p className="mt-3 text-lg font-semibold text-green-800 dark:text-green-400">
                                ⭐ {studio.rating || 0} Rating
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-6 dark:border-[#263d32] dark:bg-[#14251f]">
                            <h2 className="mb-4 text-xl font-bold">
                                About This Studio
                            </h2>

                            <p className="leading-8 text-[#40594b] dark:text-[#a7b9ae]">
                                {studio.description}
                            </p>
                        </div>

                        {/* Studio Specifications */}
                        <div className="rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-6 dark:border-[#263d32] dark:bg-[#14251f]">
                            <h2 className="mb-5 text-xl font-bold">
                                Studio Information
                            </h2>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <p className="text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                        Category
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {studio.category}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                        Maximum Capacity
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {studio.maxCapacity} People
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                        Hourly Rate
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        ${studio.price} / hour
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                        Security Deposit
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        ${studio.securityDeposit}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-6 dark:border-[#263d32] dark:bg-[#14251f]">
                            <h2 className="mb-5 text-xl font-bold">
                                Available Amenities
                            </h2>

                            {studio.amenities?.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {studio.amenities.map((amenity) => (
                                        <div
                                            key={amenity}
                                            className="flex items-center gap-3 rounded-lg bg-white/70 p-3 dark:bg-[#1b3428]"
                                        >
                                            <span className="text-green-700 dark:text-green-400">
                                                ✓
                                            </span>
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[#52665b] dark:text-[#a7b9ae]">
                                    No amenities listed.
                                </p>
                            )}
                        </div>

                        {/* Host Information */}
                        <div className="rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-6 dark:border-[#263d32] dark:bg-[#14251f]">
                            <h2 className="mb-4 text-xl font-bold">
                                Hosted By
                            </h2>

                            <p className="font-semibold">{studio.ownerName}</p>

                            <p className="mt-2 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                {studio.ownerEmail}
                            </p>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <aside>
                        <div className="sticky top-24 rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-6 shadow-sm dark:border-[#263d32] dark:bg-[#14251f]">
                            <p className="text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                Price per hour
                            </p>

                            <p className="mt-2 text-3xl font-bold text-green-800 dark:text-green-400">
                                ${studio.price}
                                <span className="text-base font-normal text-[#52665b] dark:text-[#a7b9ae]">
                                    {" "} / hour
                                </span>
                            </p>

                            <div className="my-6 border-t border-[#b8d1bf] dark:border-[#263d32]" />

                            <div className="flex justify-between gap-3">
                                <span className="text-[#52665b] dark:text-[#a7b9ae]">
                                    Security Deposit
                                </span>
                                <span className="font-semibold">
                                    ${studio.securityDeposit}
                                </span>
                            </div>

                            <div className="mt-4 flex justify-between gap-3">
                                <span className="text-[#52665b] dark:text-[#a7b9ae]">
                                    Capacity
                                </span>
                                <span className="font-semibold">
                                    {studio.maxCapacity} People
                                </span>
                            </div>

                            <div className="mt-6 rounded-lg bg-green-100 p-4 text-sm text-green-900 dark:bg-[#1b3428] dark:text-green-300">
                                Booking requests are subject to host confirmation.
                            </div>

                            <button
                                type="button"
                                disabled
                                className="mt-6 w-full cursor-not-allowed rounded-lg bg-green-800 px-5 py-3 font-semibold text-white opacity-70"
                            >
                                Booking Feature Coming Next
                            </button>

                            <p className="mt-3 text-center text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                Booking will be enabled after the booking API is ready.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}
