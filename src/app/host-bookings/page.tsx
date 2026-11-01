
"use client";

import { useEffect, useState } from "react";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Booking {
    _id: string;
    studioId: string;
    studioName: string;
    studioImage?: string;
    customerName: string;
    customerEmail: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    totalHours: number;
    totalPrice: number;
    status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
    createdAt: string;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    data: Booking[];
}

export default function HostBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processingId, setProcessingId] = useState("");
    const [notification, setNotification] = useState({
        type: "",
        message: "",
    });

    useEffect(() => {
        let cancelled = false;

        const fetchHostBookings = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/bookings/host-bookings`,
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to load booking requests."
                    );
                }

                const bookingData = Array.isArray(result)
                    ? result
                    : result.data || result.bookings || [];

                if (!cancelled) {
                    setBookings(bookingData);
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

        fetchHostBookings();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleBookingAction = async (
        bookingId: string,
        action: "confirm" | "reject"
    ) => {
        const actionText = action === "confirm" ? "confirm" : "reject";

        if (!window.confirm(`Are you sure you want to ${actionText} this booking?`)) {
            return;
        }

        try {
            setProcessingId(bookingId);
            setNotification({ type: "", message: "" });

            const response = await fetch(
                `${API_URL}/api/bookings/${bookingId}/${action}`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to update booking."
                );
            }

            setBookings((previous) =>
                previous.map((booking) =>
                    booking._id === bookingId
                        ? {
                            ...booking,
                            status:
                                action === "confirm"
                                    ? "Confirmed"
                                    : "Cancelled",
                        }
                        : booking
                )
            );

            setNotification({
                type: "success",
                message:
                    result.message ||
                    `Booking ${action === "confirm" ? "confirmed" : "rejected"} successfully!`,
            });
        } catch (err) {
            setNotification({
                type: "error",
                message:
                    err instanceof Error
                        ? err.message
                        : "Something went wrong.",
            });
        } finally {
            setProcessingId("");
        }
    };

    const getStatusStyle = (status: Booking["status"]) => {
        switch (status) {
            case "Pending":
                return "border border-yellow-300 bg-yellow-50 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-300";
            case "Confirmed":
                return "border border-green-300 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300";
            case "Completed":
                return "border border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300";
            case "Cancelled":
                return "border border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300";
            default:
                return "border border-[#b8d1bf] bg-[#dcebe0] text-[#18352a] dark:border-[#263d32] dark:bg-[#0b0f0d] dark:text-white";
        }
    };

    return (
        <main className="min-h-screen bg-[#dcebe0] px-5 py-16 text-[#18352a] dark:bg-[#0b0f0d] dark:text-white">
            <div className="mx-auto max-w-6xl">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold">
                        Booking Requests
                    </h1>

                    <p className="mt-3 text-[#52665b] dark:text-[#a7b9ae]">
                        View and manage booking requests for your creative spaces.
                    </p>

                    <p className="mt-2 text-sm font-medium">
                        Total Bookings: {bookings.length}
                    </p>
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
                            Loading booking requests...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="mt-10 rounded-xl border border-red-300 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
                        <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">
                            Unable to Load Bookings
                        </h2>

                        <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                            {error}
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && bookings.length === 0 && (
                    <div className="mt-10 rounded-xl border border-[#b8d1bf] bg-[#edf5ef] px-6 py-16 text-center dark:border-[#263d32] dark:bg-[#14251f]">
                        <div className="text-5xl">📅</div>

                        <h2 className="mt-5 text-2xl font-bold">
                            No Booking Requests Yet
                        </h2>

                        <p className="mt-3 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                            Customer booking requests for your studios will appear here.
                        </p>
                    </div>
                )}

                {/* Booking Cards */}
                {!loading && !error && bookings.length > 0 && (
                    <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-2">
                        {bookings.map((booking) => (
                            <article
                                key={booking._id}
                                className="overflow-hidden rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-[#263d32] dark:bg-[#14251f]"
                            >
                                {booking.studioImage && (
                                    <div className="h-52 overflow-hidden bg-[#b8d1bf] dark:bg-[#263d32]">
                                        <img
                                            src={booking.studioImage}
                                            alt={booking.studioName}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="p-5">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h2 className="text-xl font-bold">
                                            {booking.studioName}
                                        </h2>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>

                                    {/* Customer Information */}
                                    <div className="mt-5 rounded-xl bg-[#dcebe0] p-4 dark:bg-[#0b0f0d]">
                                        <h3 className="font-semibold">
                                            Customer Information
                                        </h3>

                                        <p className="mt-3 text-sm">
                                            <span className="text-[#52665b] dark:text-[#a7b9ae]">
                                                Name:
                                            </span>{" "}
                                            {booking.customerName}
                                        </p>

                                        <p className="mt-2 break-all text-sm">
                                            <span className="text-[#52665b] dark:text-[#a7b9ae]">
                                                Email:
                                            </span>{" "}
                                            {booking.customerEmail}
                                        </p>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        <div className="rounded-lg bg-[#dcebe0] p-3 dark:bg-[#0b0f0d]">
                                            <p className="text-[#52665b] dark:text-[#a7b9ae]">
                                                Booking Date
                                            </p>
                                            <p className="mt-1 font-semibold">
                                                {booking.bookingDate}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-[#dcebe0] p-3 dark:bg-[#0b0f0d]">
                                            <p className="text-[#52665b] dark:text-[#a7b9ae]">
                                                Duration
                                            </p>
                                            <p className="mt-1 font-semibold">
                                                {booking.totalHours} Hours
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-[#dcebe0] p-3 dark:bg-[#0b0f0d]">
                                            <p className="text-[#52665b] dark:text-[#a7b9ae]">
                                                Start Time
                                            </p>
                                            <p className="mt-1 font-semibold">
                                                {booking.startTime}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-[#dcebe0] p-3 dark:bg-[#0b0f0d]">
                                            <p className="text-[#52665b] dark:text-[#a7b9ae]">
                                                End Time
                                            </p>
                                            <p className="mt-1 font-semibold">
                                                {booking.endTime}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-5 text-2xl font-bold text-[#166534] dark:text-[#34d399]">
                                        ${booking.totalPrice.toLocaleString()}
                                        <span className="text-sm font-normal text-[#52665b] dark:text-[#a7b9ae]">
                                            {" "}Total Price
                                        </span>
                                    </p>

                                    {/* Booking Actions */}
                                    {booking.status === "Pending" && (
                                        <div className="mt-6 grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleBookingAction(
                                                        booking._id,
                                                        "confirm"
                                                    )
                                                }
                                                disabled={processingId !== ""}
                                                className="rounded-lg bg-[#166534] px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#14532d] disabled:opacity-50 dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                                            >
                                                {processingId === booking._id
                                                    ? "Processing..."
                                                    : "Confirm Booking"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleBookingAction(
                                                        booking._id,
                                                        "reject"
                                                    )
                                                }
                                                disabled={processingId !== ""}
                                                className="rounded-lg border border-red-300 px-3 py-3 text-center text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                                            >
                                                {processingId === booking._id
                                                    ? "Processing..."
                                                    : "Reject Booking"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
