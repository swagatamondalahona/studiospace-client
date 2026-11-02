"use client";

import { FormEvent, useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
    ChevronLeft,
    ChevronRight,
    Star,
    ShieldCheck,
    CheckCircle2,
    Calendar,
    Clock,
    User,
    Send,
} from "lucide-react";
import API_URL from "@/lib/api";

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

interface Review {
    id: string;
    author: string;
    role: string;
    rating: number;
    date: string;
    comment: string;
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

    // Gallery carousel states
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Reviews states
    const [newReviewComment, setNewReviewComment] = useState("");
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [submittingReview, setSubmittingReview] = useState(false);

    // Initial community reviews
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: "1",
            author: "Afsana Ahmed",
            role: "Commercial Photographer",
            rating: 5,
            date: "2 weeks ago",
            comment:
                "Incredible space! The natural lighting and equipment provided were top-notch. The host was very responsive and accommodating. Will definitely book again.",
        },
        {
            id: "2",
            author: "Rahim Chowdhury",
            role: "Podcast Producer",
            rating: 5,
            date: "1 month ago",
            comment:
                "Acoustics were exceptional, zero outside noise leakage. Super smooth check-in process and hassle-free production session.",
        },
        {
            id: "3",
            author: "Tanvir Hasan",
            role: "Visual Artist & Director",
            rating: 4,
            date: "2 months ago",
            comment:
                "Great spacious environment with high ceilings and clean amenities. Everything matches the description perfectly.",
        },
    ]);

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

    // Gallery images list (Main image + angle shots)
    const galleryImages = useMemo(() => {
        if (!studio?.image) return [];
        return [
            studio.image,
            "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
        ];
    }, [studio?.image]);

    const handlePrevImage = () => {
        setActiveImageIndex((prev) =>
            prev === 0 ? galleryImages.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setActiveImageIndex((prev) =>
            prev === galleryImages.length - 1 ? 0 : prev + 1
        );
    };

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

    // Add review
    const handleAddReview = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newReviewComment.trim()) {
            toast.error("Please write a review comment.");
            return;
        }

        setSubmittingReview(true);
        setTimeout(() => {
            const newRev: Review = {
                id: String(Date.now()),
                author: "You (Verified Creator)",
                role: "Creative Professional",
                rating: newReviewRating,
                date: "Just now",
                comment: newReviewComment.trim(),
            };
            setReviews((prev) => [newRev, ...prev]);
            setNewReviewComment("");
            setNewReviewRating(5);
            setSubmittingReview(false);
            toast.success("Thank you! Your review has been added.");
        }, 500);
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-700 border-t-transparent dark:border-[#34d399] dark:border-t-transparent" />
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
                    className="mt-6 rounded-lg bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-700 dark:bg-[#34d399] dark:text-[#0b0f0d]"
                >
                    Explore Studios
                </Link>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-[#dcebe0] px-4 py-10 text-[#18352a] dark:bg-[#0b0f0d] dark:text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                    <Link href="/" className="hover:text-green-700 dark:hover:text-[#34d399]">
                        Home
                    </Link>
                    {" / "}
                    <Link href="/studios" className="hover:text-green-700 dark:hover:text-[#34d399]">
                        Explore Studios
                    </Link>
                    {" / "}
                    <span className="font-semibold text-[#18352a] dark:text-white">
                        {studio.name}
                    </span>
                </div>

                {/* Gallery Carousel */}
                <div className="overflow-hidden rounded-3xl border border-[#b8d1bf] bg-white p-3 shadow-xl dark:border-[#263d32] dark:bg-[#14251f]">
                    <div className="relative h-[300px] overflow-hidden rounded-2xl sm:h-[480px]">
                        <Image
                            src={galleryImages[activeImageIndex] || studio.image}
                            alt={`${studio.name} - view ${activeImageIndex + 1}`}
                            fill
                            priority
                            unoptimized
                            className="object-cover transition-all duration-500"
                            sizes="(max-width: 768px) 100vw, 1200px"
                        />

                        {/* Category Badge */}
                        <span className="absolute left-5 top-5 rounded-full bg-[#166534] px-4 py-2 text-sm font-semibold text-white shadow-md dark:bg-[#34d399] dark:text-[#0b0f0d]">
                            {studio.category}
                        </span>

                        {/* Navigation Arrows */}
                        <button
                            type="button"
                            onClick={handlePrevImage}
                            aria-label="Previous gallery image"
                            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/75"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <button
                            type="button"
                            onClick={handleNextImage}
                            aria-label="Next gallery image"
                            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/75"
                        >
                            <ChevronRight size={24} />
                        </button>

                        {/* Photo counter badge */}
                        <span className="absolute bottom-5 right-5 rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                            📷 {activeImageIndex + 1} / {galleryImages.length}
                        </span>
                    </div>

                    {/* Gallery Thumbnails Strip */}
                    <div className="mt-3 flex items-center gap-3 overflow-x-auto p-1">
                        {galleryImages.map((img, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveImageIndex(idx)}
                                className={`relative h-18 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${activeImageIndex === idx
                                        ? "border-[#166534] ring-2 ring-[#166534]/30 dark:border-[#34d399]"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="mt-8 grid gap-8 lg:grid-cols-3">

                    {/* Studio Information */}
                    <div className="space-y-7 lg:col-span-2">

                        <div>
                            <h1 className="text-3xl font-bold sm:text-4xl">
                                {studio.name}
                            </h1>

                            <p className="mt-3 flex items-center gap-2 text-[#52665b] dark:text-[#a7b9ae]">
                                📍 {studio.location}
                            </p>

                            <div className="mt-3 flex items-center gap-3">
                                <span className="flex items-center gap-1.5 rounded-lg bg-yellow-50 px-3 py-1 text-sm font-bold text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300">
                                    <Star size={16} fill="currentColor" />
                                    {studio.rating || 5.0} Rating
                                </span>
                                <span className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                    ({reviews.length} verified creator reviews)
                                </span>
                            </div>
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
                                Studio Specifications
                            </h2>

                            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                                <div className="rounded-xl border border-[#b8d1bf] bg-white/70 p-4 dark:border-[#263d32] dark:bg-[#0b0f0d]">
                                    <p className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                        Category
                                    </p>
                                    <p className="mt-1 font-bold text-sm">
                                        {studio.category}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#b8d1bf] bg-white/70 p-4 dark:border-[#263d32] dark:bg-[#0b0f0d]">
                                    <p className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                        Capacity
                                    </p>
                                    <p className="mt-1 font-bold text-sm">
                                        {studio.maxCapacity} People
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#b8d1bf] bg-white/70 p-4 dark:border-[#263d32] dark:bg-[#0b0f0d]">
                                    <p className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                        Hourly Rate
                                    </p>
                                    <p className="mt-1 font-bold text-sm text-[#166534] dark:text-[#34d399]">
                                        ${studio.price}/hr
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#b8d1bf] bg-white/70 p-4 dark:border-[#263d32] dark:bg-[#0b0f0d]">
                                    <p className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                        Deposit
                                    </p>
                                    <p className="mt-1 font-bold text-sm">
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
                                            <span className="text-sm font-medium">{amenity}</span>
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

                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#166534] text-lg font-bold text-white dark:bg-[#34d399] dark:text-[#0b0f0d]">
                                    {studio.ownerName?.charAt(0)?.toUpperCase() || "H"}
                                </div>
                                <div>
                                    <p className="font-bold text-base">
                                        {studio.ownerName}
                                    </p>
                                    <p className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                        Verified Studio Host · {studio.ownerEmail}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-6 dark:border-[#263d32] dark:bg-[#14251f]">
                            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        Creator Reviews & Experiences
                                    </h2>
                                    <p className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                        Authentic feedback from verified bookings
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-500">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={18} fill="currentColor" />
                                        ))}
                                    </div>
                                    <span className="font-bold text-sm">
                                        {studio.rating || 5.0} / 5.0
                                    </span>
                                </div>
                            </div>

                            {/* Reviews List */}
                            <div className="space-y-4">
                                {reviews.map((rev) => (
                                    <div
                                        key={rev.id}
                                        className="rounded-xl border border-[#b8d1bf] bg-white/80 p-4 dark:border-[#263d32] dark:bg-[#0b0f0d]"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dcebe0] text-xs font-bold text-[#166534] dark:bg-[#263d32] dark:text-[#34d399]">
                                                    {rev.author.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">
                                                        {rev.author}
                                                    </p>
                                                    <p className="text-[11px] text-[#52665b] dark:text-[#a7b9ae]">
                                                        {rev.role} · {rev.date}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex text-yellow-500">
                                                {Array.from({ length: rev.rating }).map((_, i) => (
                                                    <Star key={i} size={14} fill="currentColor" />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="mt-3 text-sm leading-6 text-[#40594b] dark:text-[#a7b9ae]">
                                            &ldquo;{rev.comment}&rdquo;
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Add Review Form */}
                            <form onSubmit={handleAddReview} className="mt-6 border-t border-[#b8d1bf] pt-6 dark:border-[#263d32]">
                                <h3 className="mb-3 text-sm font-bold">
                                    Leave a Review for this Studio
                                </h3>

                                <div className="mb-3 flex items-center gap-2">
                                    <span className="text-xs text-[#52665b] dark:text-[#a7b9ae]">Rating:</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setNewReviewRating(star)}
                                                className="text-yellow-500 transition hover:scale-110"
                                            >
                                                <Star
                                                    size={18}
                                                    fill={star <= newReviewRating ? "currentColor" : "none"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <textarea
                                        rows={2}
                                        value={newReviewComment}
                                        onChange={(e) => setNewReviewComment(e.target.value)}
                                        placeholder="Share your creative experience with this space..."
                                        className="w-full resize-none rounded-xl border border-[#b8d1bf] bg-white px-3 py-2 text-sm text-[#18352a] outline-none transition focus:border-[#166534] dark:border-[#263d32] dark:bg-[#0b0f0d] dark:text-white dark:focus:border-[#34d399]"
                                    />
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="flex items-center gap-1.5 self-end rounded-xl bg-[#166534] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#14532d] disabled:opacity-50 dark:bg-[#34d399] dark:text-[#0b0f0d]"
                                    >
                                        <Send size={15} />
                                        Post
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Booking Summary Sidebar */}
                    <aside>
                        <div className="sticky top-24 rounded-3xl border border-[#b8d1bf] bg-[#edf5ef] p-6 shadow-md dark:border-[#263d32] dark:bg-[#14251f]">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#52665b] dark:text-[#a7b9ae]">
                                Hourly Rate
                            </p>

                            <p className="mt-2 text-4xl font-extrabold text-green-800 dark:text-[#34d399]">
                                ${studio.price}
                                <span className="text-base font-normal text-[#52665b] dark:text-[#a7b9ae]">
                                    {" "} / hour
                                </span>
                            </p>

                            <div className="my-6 border-t border-[#b8d1bf] dark:border-[#263d32]" />

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between gap-3">
                                    <span className="text-[#52665b] dark:text-[#a7b9ae]">
                                        Security Deposit
                                    </span>
                                    <span className="font-semibold">
                                        ${studio.securityDeposit}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-[#52665b] dark:text-[#a7b9ae]">
                                        Capacity
                                    </span>
                                    <span className="font-semibold">
                                        {studio.maxCapacity} People
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-[#52665b] dark:text-[#a7b9ae]">
                                        Status
                                    </span>
                                    <span className="font-semibold text-green-700 dark:text-green-400">
                                        Available Now
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 rounded-xl bg-green-100 p-4 text-xs leading-5 text-green-900 dark:bg-[#1b3428] dark:text-green-300">
                                🛡️ Host Guarantee applies. Reservation requests are held safely as Pending until the host confirms.
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsBookingOpen(true)}
                                className="mt-6 w-full rounded-xl bg-[#166534] px-5 py-3.5 font-bold text-white shadow-lg shadow-green-900/15 transition hover:bg-[#14532d] dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                            >
                                Book Workspace Now
                            </button>

                            <p className="mt-3 text-center text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                Instant booking inquiry · Direct host response
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Booking Modal Dialog */}
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
                        className="my-auto w-full max-w-lg rounded-3xl border border-[#b8d1bf] bg-[#edf5ef] p-6 shadow-2xl dark:border-[#263d32] dark:bg-[#14251f] sm:p-8"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id="booking-modal-title"
                                    className="text-2xl font-bold"
                                >
                                    Book Your Workspace
                                </h2>

                                <p className="mt-1 text-sm font-semibold text-[#166534] dark:text-[#34d399]">
                                    {studio.name}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsBookingOpen(false)}
                                disabled={bookingLoading}
                                aria-label="Close booking modal"
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg font-bold text-gray-500 shadow-sm transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:bg-[#0b0f0d] dark:hover:bg-red-950/30"
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
                                    className="w-full rounded-xl border border-[#b8d1bf] bg-white px-4 py-3 text-[#18352a] outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20 dark:border-[#365345] dark:bg-[#0b0f0d] dark:text-white"
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
                                        className="w-full rounded-xl border border-[#b8d1bf] bg-white px-4 py-3 text-[#18352a] outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20 dark:border-[#365345] dark:bg-[#0b0f0d] dark:text-white"
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
                                        className="w-full rounded-xl border border-[#b8d1bf] bg-white px-4 py-3 text-[#18352a] outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20 dark:border-[#365345] dark:bg-[#0b0f0d] dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="rounded-2xl border border-[#b8d1bf] bg-white/70 p-5 dark:border-[#365345] dark:bg-[#0b0f0d]">
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

                                    <span className="text-xl font-bold text-green-800 dark:text-[#34d399]">
                                        ${totalPrice.toLocaleString()}
                                    </span>
                                </div>

                                <p className="mt-3 text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                    Security deposit: ${studio.securityDeposit}. Deposit is refunded after your shoot.
                                </p>
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    disabled={bookingLoading}
                                    onClick={() => setIsBookingOpen(false)}
                                    className="w-full rounded-xl border border-[#b8d1bf] px-5 py-3 font-semibold transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#365345] dark:hover:bg-[#1b3428]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={bookingLoading}
                                    className="w-full rounded-xl bg-[#166534] px-5 py-3 font-bold text-white transition hover:bg-[#14532d] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                                >
                                    {bookingLoading
                                        ? "Submitting..."
                                        : "Confirm Booking Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
