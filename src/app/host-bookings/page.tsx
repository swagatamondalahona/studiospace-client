"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import API_URL from "@/lib/api";

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
    const [activeModal, setActiveModal] = useState<{
        booking: Booking;
        action: "confirm" | "reject";
    } | null>(null);

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

    const executeBookingAction = async () => {
        if (!activeModal) return;

        const { booking, action } = activeModal;

        try {
            setProcessingId(booking._id);

            const response = await fetch(
                `${API_URL}/api/bookings/${booking._id}/${action}`,
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
                previous.map((b) =>
                    b._id === booking._id
                        ? {
                            ...b,
                            status:
                                action === "confirm"
                                    ? "Confirmed"
                                    : "Cancelled",
                        }
                        : b
                )
            );

            const successMsg =
                result.message ||
                `Booking ${action === "confirm" ? "confirmed" : "rejected"} successfully!`;
            toast.success(successMsg);
            setActiveModal(null);
        } catch (err) {
            const errorMsg =
                err instanceof Error
                    ? err.message
                    : "Something went wrong.";
            toast.error(errorMsg);
        } finally {
            setProcessingId("");
        }
    };

    const getStatusStyle = (status: Booking["status"]) => {
        switch (status) {
            case "Pending":
                return "border-yellow-300 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300";
            case "Confirmed":
                return "border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300";
            case "Completed":
                return "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300";
            case "Cancelled":
                return "border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300";
            default:
                return "border-gray-300 bg-gray-50 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300";
        }
    };

    const formatDate = (date: string) => {
        const [year, month, day] = date.split("-").map(Number);
        return new Date(year, month - 1, day).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <section className="min-h-screen bg-[#dcebe0] px-5 py-16 text-[#18352a] dark:bg-[#0b0f0d] dark:text-white">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Host Booking Requests
                        </h1>
                        <p className="mt-2 text-[#52665b] dark:text-[#a7b9ae]">
                            Manage and review reservation requests from creators for your studios.
                        </p>
                    </div>

                    <div className="rounded-xl border border-[#b8d1bf] bg-[#edf5ef] px-4 py-2 text-sm font-semibold dark:border-[#263d32] dark:bg-[#14251f]">
                        Total Requests: {bookings.length}
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="mt-14 flex flex-col items-center justify-center py-16">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#b8d1bf] border-t-[#166534] dark:border-[#263d32] dark:border-t-[#34d399]" />
                        <p className="mt-4 text-[#52665b] dark:text-[#a7b9ae]">
                            Loading booking requests...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="mt-10 rounded-2xl border border-red-300 bg-red-50 p-6 text-center text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && bookings.length === 0 && (
                    <div className="mt-10 rounded-3xl border border-[#b8d1bf] bg-[#edf5ef] px-6 py-16 text-center dark:border-[#263d32] dark:bg-[#14251f]">
                        <div className="text-5xl">📅</div>
                        <h2 className="mt-4 text-2xl font-bold">
                            No Booking Requests Yet
                        </h2>
                        <p className="mt-2 text-[#52665b] dark:text-[#a7b9ae]">
                            When creators book your studios, their requests will appear here for your confirmation.
                        </p>
                    </div>
                )}

                {/* Bookings Grid */}
                {!loading && !error && bookings.length > 0 && (
                    <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {bookings.map((booking) => (
                            <article
                                key={booking._id}
                                className="overflow-hidden rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] shadow-sm transition hover:shadow-md dark:border-[#263d32] dark:bg-[#14251f]"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <h2 className="text-xl font-bold">
                                            {booking.studioName}
                                        </h2>

                                        <span
                                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>

                                    {/* Creator info */}
                                    <div className="mt-4 rounded-xl border border-[#b8d1bf] bg-[#dcebe0] p-3 text-sm dark:border-[#263d32] dark:bg-[#0b0f0d]">
                                        <p className="font-semibold text-[#18352a] dark:text-white">
                                            👤 {booking.customerName}
                                        </p>
                                        <p className="mt-1 text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                            ✉️ {booking.customerEmail}
                                        </p>
                                    </div>

                                    {/* Date & Time */}
                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        <div className="col-span-2 rounded-lg bg-[#dcebe0] p-3 dark:bg-[#0b0f0d]">
                                            <p className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                                Booking Date
                                            </p>
                                            <p className="mt-1 font-semibold">
                                                {formatDate(booking.bookingDate)}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-[#dcebe0] p-3 dark:bg-[#0b0f0d]">
                                            <p className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                                Start Time
                                            </p>
                                            <p className="mt-1 font-semibold">
                                                {booking.startTime}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-[#dcebe0] p-3 dark:bg-[#0b0f0d]">
                                            <p className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
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
                                            {" "}Total Price ({booking.totalHours} hrs)
                                        </span>
                                    </p>

                                    {/* Booking Actions */}
                                    {booking.status === "Pending" && (
                                        <div className="mt-6 grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveModal({
                                                        booking,
                                                        action: "confirm",
                                                    })
                                                }
                                                disabled={processingId !== ""}
                                                className="rounded-lg bg-[#166534] px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#14532d] disabled:opacity-50 dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                                            >
                                                Confirm Booking
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveModal({
                                                        booking,
                                                        action: "reject",
                                                    })
                                                }
                                                disabled={processingId !== ""}
                                                className="rounded-lg border border-red-300 px-3 py-3 text-center text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                                            >
                                                Reject Booking
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {/* Custom Action Confirmation Modal */}
            {activeModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !processingId
                        ) {
                            setActiveModal(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        className="w-full max-w-md rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-6 shadow-2xl dark:border-[#263d32] dark:bg-[#14251f]"
                    >
                        <div
                            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl ${activeModal.action === "confirm"
                                    ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                                }`}
                        >
                            {activeModal.action === "confirm" ? "✓" : "⚠️"}
                        </div>

                        <h2
                            id="modal-title"
                            className="mt-5 text-center text-xl font-bold text-[#18352a] dark:text-[#e5f2e9]"
                        >
                            {activeModal.action === "confirm"
                                ? "Confirm This Booking?"
                                : "Reject This Booking?"}
                        </h2>

                        <p className="mt-3 text-center text-sm leading-6 text-[#52665b] dark:text-[#a7b9ae]">
                            Are you sure you want to{" "}
                            <strong>{activeModal.action}</strong> the reservation for{" "}
                            <strong className="text-[#18352a] dark:text-[#e5f2e9]">
                                {activeModal.booking.customerName}
                            </strong>{" "}
                            at{" "}
                            <strong className="text-[#18352a] dark:text-[#e5f2e9]">
                                {activeModal.booking.studioName}
                            </strong>{" "}
                            on {activeModal.booking.bookingDate} ({activeModal.booking.startTime} - {activeModal.booking.endTime})?
                        </p>

                        <div className="mt-7 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setActiveModal(null)}
                                disabled={processingId !== ""}
                                className="rounded-xl border border-[#b8d1bf] px-4 py-3 font-semibold text-[#18352a] transition hover:bg-[#dcebe0] disabled:opacity-50 dark:border-[#263d32] dark:text-[#e5f2e9] dark:hover:bg-[#1b3428]"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={executeBookingAction}
                                disabled={processingId !== ""}
                                className={`rounded-xl px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${activeModal.action === "confirm"
                                        ? "bg-[#166534] hover:bg-[#14532d] dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                                        : "bg-red-600 hover:bg-red-700"
                                    }`}
                            >
                                {processingId
                                    ? "Processing..."
                                    : activeModal.action === "confirm"
                                        ? "Yes, Confirm"
                                        : "Yes, Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
