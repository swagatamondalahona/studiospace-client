
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Studio {
    _id: string;
    name: string;
    category: string;
    location: string;
    price: number;
    securityDeposit: number;
    maxCapacity: number;
    image: string;
    amenities: string[];
    description: string;
    rating: number;
    ownerName: string;
    ownerEmail: string;
    createdAt: string;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    data: Studio[];
}

export default function MyListingsPage() {
    const [studios, setStudios] = useState<Studio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState("");
    const [notification, setNotification] = useState({
        type: "",
        message: "",
    });

    useEffect(() => {
        let cancelled = false;

        const fetchMyListings = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/studios/my-listings`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const result: ApiResponse = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to load your listings."
                    );
                }

                if (!cancelled) {
                    setStudios(result.data || []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Something went wrong."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchMyListings();

        return () => {
            cancelled = true;
        };
    }, []);

    // Delete Studio
    const handleDeleteStudio = async () => {
        if (!selectedStudio) return;

        try {
            setDeleting(true);
            setDeletingId(selectedStudio._id);
            setNotification({ type: "", message: "" });

            const response = await fetch(
                `${API_URL}/api/studios/${selectedStudio._id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to delete studio."
                );
            }

            setStudios((previous) =>
                previous.filter(
                    (studio) => studio._id !== selectedStudio._id
                )
            );

            setSelectedStudio(null);

            setNotification({
                type: "success",
                message: "Studio deleted successfully!",
            });
        } catch (err) {
            setNotification({
                type: "error",
                message:
                    err instanceof Error
                        ? err.message
                        : "Something went wrong while deleting.",
            });
        } finally {
            setDeleting(false);
            setDeletingId("");
        }
    };

    return (
        <main className="min-h-screen bg-[#dcebe0] px-5 py-16 text-[#18352a] dark:bg-[#0b0f0d] dark:text-white">
            <div className="mx-auto max-w-6xl">

                {/* Page Header */}
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">
                            My Studio Listings
                        </h1>

                        <p className="mt-3 text-[#52665b] dark:text-[#a7b9ae]">
                            Manage the creative spaces you have added to StudioSpace.
                        </p>

                        <p className="mt-2 text-sm font-medium">
                            Total Studios: {studios.length}
                        </p>
                    </div>

                    <Link
                        href="/add-studio"
                        className="inline-flex w-fit items-center justify-center rounded-lg bg-[#166534] px-6 py-3 font-semibold text-white transition hover:bg-[#14532d] dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                    >
                        + Add New Studio
                    </Link>
                </div>

                {/* Notification */}
                {notification.message && (
                    <div
                        role="status"
                        className={`mt-6 rounded-xl border p-4 text-sm font-medium ${notification.type === "success"
                                ? "border-green-300 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300"
                                : "border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                            }`}
                    >
                        {notification.message}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="mt-12 flex flex-col items-center justify-center py-16">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#b8d1bf] border-t-[#166534] dark:border-[#263d32] dark:border-t-[#34d399]" />

                        <p className="mt-4 text-[#52665b] dark:text-[#a7b9ae]">
                            Loading your studios...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="mt-10 rounded-xl border border-red-300 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
                        <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">
                            Unable to Load Listings
                        </h2>

                        <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                            {error}
                        </p>

                        <p className="mt-3 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                            Please check your login session and backend server.
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && studios.length === 0 && (
                    <div className="mt-10 rounded-xl border border-[#b8d1bf] bg-[#edf5ef] px-6 py-16 text-center dark:border-[#263d32] dark:bg-[#14251f]">
                        <div className="text-5xl">🏢</div>

                        <h2 className="mt-5 text-2xl font-bold">
                            No Studio Listings Yet
                        </h2>

                        <p className="mt-3 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                            Your studio listings will appear here after you add one.
                        </p>

                        <Link
                            href="/add-studio"
                            className="mt-6 inline-flex rounded-lg bg-[#166534] px-6 py-3 font-semibold text-white transition hover:bg-[#14532d] dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                        >
                            Add Your First Studio
                        </Link>
                    </div>
                )}

                {/* Studio Cards */}
                {!loading && !error && studios.length > 0 && (
                    <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {studios.map((studio) => (
                            <article
                                key={studio._id}
                                className="overflow-hidden rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-[#263d32] dark:bg-[#14251f]"
                            >
                                {/* Studio Image */}
                                <div className="relative h-52 overflow-hidden bg-[#b8d1bf] dark:bg-[#263d32]">
                                    <img
                                        src={studio.image}
                                        alt={studio.name}
                                        className="h-full w-full object-cover"
                                    />

                                    <span className="absolute left-4 top-4 rounded-full bg-[#166534] px-3 py-1 text-xs font-semibold text-white dark:bg-[#34d399] dark:text-[#0b0f0d]">
                                        {studio.category}
                                    </span>
                                </div>

                                {/* Studio Information */}
                                <div className="p-5">
                                    <h2 className="text-xl font-bold">
                                        {studio.name}
                                    </h2>

                                    <p className="mt-2 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                        📍 {studio.location}
                                    </p>

                                    <p className="mt-4 text-2xl font-bold text-[#166534] dark:text-[#34d399]">
                                        ${studio.price}
                                        <span className="text-sm font-normal text-[#52665b] dark:text-[#a7b9ae]">
                                            {" "} / hour
                                        </span>
                                    </p>

                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        <div className="rounded-lg bg-[#dcebe0] p-3 dark:bg-[#0b0f0d]">
                                            <p className="text-[#52665b] dark:text-[#a7b9ae]">
                                                Security Deposit
                                            </p>
                                            <p className="mt-1 font-semibold">
                                                ${studio.securityDeposit}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-[#dcebe0] p-3 dark:bg-[#0b0f0d]">
                                            <p className="text-[#52665b] dark:text-[#a7b9ae]">
                                                Max Capacity
                                            </p>
                                            <p className="mt-1 font-semibold">
                                                {studio.maxCapacity} People
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#40594b] dark:text-[#a7b9ae]">
                                        {studio.description}
                                    </p>

                                    {/* Amenities */}
                                    {studio.amenities?.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {studio.amenities.map((amenity) => (
                                                <span
                                                    key={amenity}
                                                    className="rounded-full border border-[#b8d1bf] px-3 py-1 text-xs dark:border-[#263d32]"
                                                >
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-6 grid grid-cols-2 gap-3">
                                        <Link
                                            href={`/studios/${studio._id}`}
                                            className="rounded-lg bg-[#166534] px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#14532d] dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                                        >
                                            View Details
                                        </Link>

                                        <Link
                                            href={`/studios/edit/${studio._id}`}
                                            className="rounded-lg border border-[#166534] px-3 py-3 text-center text-sm font-semibold text-[#166534] transition hover:bg-[#dcebe0] dark:border-[#34d399] dark:text-[#34d399] dark:hover:bg-[#1b3428]"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedStudio(studio)}
                                            disabled={deleting}
                                            className="col-span-2 rounded-lg border border-red-300 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                                        >
                                            Delete Studio
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {selectedStudio && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !deleting
                        ) {
                            setSelectedStudio(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-modal-title"
                        className="w-full max-w-md rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-6 shadow-2xl dark:border-[#263d32] dark:bg-[#14251f]"
                    >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl dark:bg-red-950/50">
                            🗑️
                        </div>

                        <h2
                            id="delete-modal-title"
                            className="mt-5 text-center text-xl font-bold text-[#18352a] dark:text-[#e5f2e9]"
                        >
                            Delete Studio?
                        </h2>

                        <p className="mt-3 text-center text-sm leading-6 text-[#52665b] dark:text-[#a7b9ae]">
                            Are you sure you want to delete{" "}
                            <strong className="text-[#18352a] dark:text-[#e5f2e9]">
                                {selectedStudio.name}
                            </strong>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-7 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedStudio(null)}
                                disabled={deleting}
                                className="rounded-xl border border-[#b8d1bf] px-4 py-3 font-semibold text-[#18352a] transition hover:bg-[#dcebe0] disabled:opacity-50 dark:border-[#263d32] dark:text-[#e5f2e9] dark:hover:bg-[#1b3428]"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteStudio}
                                disabled={deleting}
                                className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
