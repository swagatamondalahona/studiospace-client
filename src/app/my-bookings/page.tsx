"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import API_URL, { getAuthHeaders } from "@/lib/api";

interface Booking {
    _id: string;
    studioId: string;
    studioName: string;
    studioImage?: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    totalHours: number;
    totalPrice: number;
    status: "Pending" | "Confirmed" | "Cancelled";
    createdAt: string;
}

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedBooking, setSelectedBooking] =
        useState<Booking | null>(null);
    const [cancelling, setCancelling] = useState(false);
    const [notification, setNotification] = useState("");

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/bookings/my-bookings`,
                {
                    headers: {
                        ...getAuthHeaders(),
                    },
                    credentials: "include",
                    cache: "no-store",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to load bookings."
                );
            }

            setBookings(result.data || []);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleCancelBooking = async () => {
        if (!selectedBooking) return;

        try {
            setCancelling(true);
            setNotification("");

            const response = await fetch(
                `${API_URL}/api/bookings/${selectedBooking._id}/cancel`,
                {
                    method: "PATCH",
                    headers: {
                        ...getAuthHeaders(),
                    },
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to cancel booking."
                );
            }

            setBookings((previous) =>
                previous.map((booking) =>
                    booking._id === selectedBooking._id
                        ? { ...booking, status: "Cancelled" }
                        : booking
                )
            );

            toast.success("Booking cancelled successfully!");
            setNotification("Booking cancelled successfully!");
            setSelectedBooking(null);
        } catch (err) {
            const errorMsg =
                err instanceof Error
                    ? err.message
                    : "Failed to cancel booking.";
            toast.error(errorMsg);
            setNotification(errorMsg);
        } finally {
            setCancelling(false);
        }
    };

    const formatDate = (date: string) => {
        const [year, month, day] = date.split("-").map(Number);

        return new Date(year, month - 1, day).toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );
    };

    const getStatusStyle = (status: Booking["status"]) => {
        switch (status) {
            case "Confirmed":
                return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
            case "Cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
            default:
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-700 border-t-transparent dark:border-[#34d399] dark:border-t-transparent" />
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-[#dcebe0] px-4 py-12 text-[#18352a] dark:bg-[#0b0f0d] dark:text-white">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-2 font-semibold text-green-800 dark:text-green-400">
                            Your Reservations
                        </p>

                        <h1 className="text-3xl font-bold sm:text-4xl">
                            My Bookings
                        </h1>

                        <p className="mt-3 text-[#52665b] dark:text-[#a7b9ae]">
                            View and manage your studio booking requests.
                        </p>
                    </div>

                    <Link
                        href="/studios"
                        className="inline-flex items-center justify-center rounded-lg bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-700 dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                    >
                        Explore Studios
                    </Link>
                </div>

                {/* Notification */}
                {notification && (
                    <div
                        role="status"
                        className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-green-300 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300"
                    >
                        <p>{notification}</p>

                        <button
                            onClick={() => setNotification("")}
                            className="font-bold"
                            aria-label="Dismiss notification"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-5 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                        <p>{error}</p>

                        <button
                            onClick={fetchBookings}
                            className="mt-3 font-semibold underline"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Booking Count */}
                <div className="mb-8 rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-5 dark:border-[#263d32] dark:bg-[#14251f]">
                    <p className="text-sm text-[#52665b] dark:text-[#a7b9ae]">
                        Total Bookings
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {bookings.length}
                    </p>
                </div>

                {/* Empty State */}
                {!error && bookings.length === 0 && (
                    <div className="rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] px-6 py-16 text-center dark:border-[#263d32] dark:bg-[#14251f]">
                        <div className="mb-5 text-6xl">📅</div>

                        <h2 className="text-2xl font-bold">
                            No Bookings Yet
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-[#52665b] dark:text-[#a7b9ae]">
                            Your studio booking requests will appear here
                            when you book a creative space.
                        </p>

                        <Link
                            href="/studios"
                            className="mt-7 inline-flex rounded-lg bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-700 dark:bg-[#34d399] dark:text-[#0b0f0d]"
                        >
                            Explore Studios
                        </Link>
                    </div>
                )}

                {/* Booking Cards */}
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <article
                            key={booking._id}
                            className="overflow-hidden rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] shadow-sm dark:border-[#263d32] dark:bg-[#14251f]"
                        >
                            <div className="grid md:grid-cols-[240px_1fr]">

                                {/* Studio Image */}
                                <div className="relative min-h-[220px] bg-[#b8d1bf] dark:bg-[#263d32]">
                                    {booking.studioImage ? (
                                        <Image
                                            src={booking.studioImage}
                                            alt={booking.studioName}
                                            fill
                                            unoptimized
                                            sizes="(max-width: 768px) 100vw, 240px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full min-h-[220px] items-center justify-center text-5xl">
                                            🏢
                                        </div>
                                    )}
                                </div>

                                {/* Booking Details */}
                                <div className="p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <h2 className="text-xl font-bold">
                                                {booking.studioName}
                                            </h2>

                                            <p className="mt-2 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                                Booking ID: {booking._id.slice(-8)}
                                            </p>
                                        </div>

                                        <span
                                            className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
                                        <div>
                                            <p className="text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                                Booking Date
                                            </p>
                                            <p className="mt-1 font-semibold">
                                                {formatDate(booking.bookingDate)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                                Start Time
                                            </p>
                                            <p className="mt-1 font-semibold">
                                                {booking.startTime}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                                End Time
                                            </p>
                                            <p className="mt-1 font-semibold">
                                                {booking.endTime}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                                Duration
                                            </p>
                                            <p className="mt-1 font-semibold">
                                                {booking.totalHours} Hours
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                                Total Price
                                            </p>
                                            <p className="mt-1 font-bold text-green-800 dark:text-green-400">
                                                ${booking.totalPrice.toLocaleString("en-US")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-3 border-t border-[#b8d1bf] pt-5 dark:border-[#263d32]">
                                        <Link
                                            href={`/studios/${booking.studioId}`}
                                            className="rounded-lg border border-green-800 px-5 py-2.5 font-semibold text-green-800 transition hover:bg-green-100 dark:border-green-400 dark:text-green-400 dark:hover:bg-[#1b3428]"
                                        >
                                            View Studio
                                        </Link>

                                        {booking.status === "Pending" && (
                                            <button
                                                type="button"
                                                onClick={() => setSelectedBooking(booking)}
                                                className="rounded-lg bg-red-700 px-5 py-2.5 font-semibold text-white transition hover:bg-red-800"
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cancel-booking-title"
                        className="w-full max-w-md rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-7 text-[#18352a] shadow-2xl dark:border-[#263d32] dark:bg-[#14251f] dark:text-white"
                    >
                        <div className="mb-5 text-4xl">⚠️</div>

                        <h2
                            id="cancel-booking-title"
                            className="text-2xl font-bold"
                        >
                            Cancel Booking?
                        </h2>

                        <p className="mt-3 leading-7 text-[#52665b] dark:text-[#a7b9ae]">
                            Are you sure you want to cancel your booking for{" "}
                            <strong>{selectedBooking.studioName}</strong>?
                        </p>

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                disabled={cancelling}
                                onClick={() => setSelectedBooking(null)}
                                className="rounded-lg border border-[#b8d1bf] px-5 py-3 font-semibold transition hover:bg-white dark:border-[#263d32] dark:hover:bg-[#1b3428]"
                            >
                                Keep Booking
                            </button>

                            <button
                                type="button"
                                disabled={cancelling}
                                onClick={handleCancelBooking}
                                className="rounded-lg bg-red-700 px-5 py-3 font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {cancelling ? "Cancelling..." : "Yes, Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
