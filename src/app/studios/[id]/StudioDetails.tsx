
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

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

interface BookingForm {
    bookingDate: string;
    startTime: string;
    endTime: string;
}

const getLocalDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const getBookingHours = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 0;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    return (end - start) / 60;
};

export default function StudioDetails() {
    const params = useParams();
    const id = params.id as string;

    const [studio, setStudio] = useState<Studio | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Booking states
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);

    const [bookingForm, setBookingForm] = useState<BookingForm>({
        bookingDate: "",
        startTime: "",
        endTime: "",
    });

    const bookingHours = getBookingHours(
        bookingForm.startTime,
        bookingForm.endTime
    );

    const totalPrice =
        studio && bookingHours > 0
            ? studio.price * bookingHours
            : 0;

    // Fetch studio details
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

    // Update booking form
    const handleBookingChange = (
        field: keyof BookingForm,
        value: string
    ) => {
        setBookingForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    // Submit booking
    const handleBookingSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!studio) return;

        if (
            !bookingForm.bookingDate ||
            !bookingForm.startTime ||
            !bookingForm.endTime
        ) {
            toast.error("Please complete all booking fields.");
            return;
        }

        if (bookingForm.bookingDate < getLocalDate()) {
            toast.error("Please select today or a future date.");
            return;
        }

        if (bookingHours < 1) {
            toast.error("Booking must be at least 1 hour.");
            return;
        }

        if (!Number.isInteger(bookingHours)) {
            toast.error("Please select a whole number of booking hours.");
            return;
        }

        try {
            setBookingLoading(true);

            const response = await fetch(`${API_URL}/api/bookings`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studioId: studio._id,
                    bookingDate: bookingForm.bookingDate,
                    startTime: bookingForm.startTime,
                    endTime: bookingForm.endTime,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to submit booking."
                );
            }

            toast.success(
                "Booking request submitted successfully! Waiting for host confirmation."
            );

            setIsBookingOpen(false);

            setBookingForm({
                bookingDate: "",
                startTime: "",
                endTime: "",
            });
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setBookingLoading(false);
        }
    };

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

                        {/* Description */}
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

                            <p className="font-semibold">
                                {studio.ownerName}
                            </p>

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
                                onClick={() => setIsBookingOpen(true)}
                                className="mt-6 w-full rounded-lg bg-green-800 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                            >
                                Book Workspace Now
                            </button>

                            <p className="mt-3 text-center text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                Your booking will remain Pending until the host responds.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Booking Modal */}
            {isBookingOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !bookingLoading) {
                            setIsBookingOpen(false);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="booking-modal-title"
                        className="my-auto w-full max-w-lg rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-6 shadow-2xl dark:border-[#263d32] dark:bg-[#14251f] sm:p-8"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id="booking-modal-title"
                                    className="text-2xl font-bold"
                                >
                                    Book Your Workspace
                                </h2>

                                <p className="mt-2 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                    {studio.name}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsBookingOpen(false)}
                                disabled={bookingLoading}
                                aria-label="Close booking modal"
                                className="rounded-lg px-3 py-1 text-2xl text-gray-500 transition hover:bg-green-100 hover:text-green-900 disabled:opacity-50 dark:hover:bg-[#1b3428] dark:hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={handleBookingSubmit}
                            className="mt-7 space-y-5"
                        >
                            {/* Booking Date */}
                            <div>
                                <label
                                    htmlFor="bookingDate"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Booking Date
                                </label>

                                <input
                                    id="bookingDate"
                                    type="date"
                                    required
                                    min={getLocalDate()}
                                    value={bookingForm.bookingDate}
                                    onChange={(event) =>
                                        handleBookingChange(
                                            "bookingDate",
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-[#b8d1bf] bg-white px-4 py-3 text-[#18352a] outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20 dark:border-[#365345] dark:bg-[#0b0f0d] dark:text-white"
                                />
                            </div>

                            {/* Start and End Time */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="startTime"
                                        className="mb-2 block text-sm font-semibold"
                                    >
                                        Start Time
                                    </label>

                                    <input
                                        id="startTime"
                                        type="time"
                                        required
                                        value={bookingForm.startTime}
                                        onChange={(event) =>
                                            handleBookingChange(
                                                "startTime",
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-[#b8d1bf] bg-white px-4 py-3 text-[#18352a] outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20 dark:border-[#365345] dark:bg-[#0b0f0d] dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="endTime"
                                        className="mb-2 block text-sm font-semibold"
                                    >
                                        End Time
                                    </label>

                                    <input
                                        id="endTime"
                                        type="time"
                                        required
                                        min={bookingForm.startTime || undefined}
                                        value={bookingForm.endTime}
                                        onChange={(event) =>
                                            handleBookingChange(
                                                "endTime",
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-[#b8d1bf] bg-white px-4 py-3 text-[#18352a] outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20 dark:border-[#365345] dark:bg-[#0b0f0d] dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="rounded-xl border border-[#b8d1bf] bg-white/70 p-5 dark:border-[#365345] dark:bg-[#0b0f0d]">
                                <div className="flex justify-between gap-3 text-sm">
                                    <span className="text-[#52665b] dark:text-[#a7b9ae]">
                                        Hourly Rate
                                    </span>
                                    <span className="font-semibold">
                                        ${studio.price}
                                    </span>
                                </div>

                                <div className="mt-3 flex justify-between gap-3 text-sm">
                                    <span className="text-[#52665b] dark:text-[#a7b9ae]">
                                        Duration
                                    </span>
                                    <span className="font-semibold">
                                        {bookingHours > 0
                                            ? `${bookingHours} hour${bookingHours > 1 ? "s" : ""}`
                                            : "—"}
                                    </span>
                                </div>

                                <div className="my-4 border-t border-[#b8d1bf] dark:border-[#365345]" />

                                <div className="flex justify-between gap-3">
                                    <span className="font-bold">
                                        Estimated Total
                                    </span>

                                    <span className="text-xl font-bold text-green-800 dark:text-green-400">
                                        ${totalPrice.toLocaleString()}
                                    </span>
                                </div>

                                <p className="mt-3 text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                    Security deposit: ${studio.securityDeposit}. Any deposit is separate from the booking total.
                                </p>
                            </div>

                            <div className="rounded-lg bg-green-100 p-3 text-sm text-green-900 dark:bg-[#1b3428] dark:text-green-300">
                                Your request will be sent to the host for confirmation.
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    disabled={bookingLoading}
                                    onClick={() => setIsBookingOpen(false)}
                                    className="w-full rounded-lg border border-[#b8d1bf] px-5 py-3 font-semibold transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#365345] dark:hover:bg-[#1b3428]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={bookingLoading}
                                    className="w-full rounded-lg bg-green-800 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {bookingLoading
                                        ? "Submitting..."
                                        : "Confirm Booking"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
