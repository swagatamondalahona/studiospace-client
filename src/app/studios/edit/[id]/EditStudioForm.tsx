
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = [
    "Photo Studios",
    "Video Production",
    "Music Studios",
    "Podcast Studios",
    "Event Spaces",
    "Creative Spaces",
];

const availableAmenities = [
    "Free Wi-Fi",
    "Air Conditioning",
    "Parking",
    "Soundproofing",
    "Lighting Equipment",
    "Camera Equipment",
    "Editing Room",
    "Green Screen",
    "Restroom",
    "Waiting Area",
];

interface Studio {
    _id: string;
    name: string;
    category: string;
    location: string;
    price: number;
    securityDeposit: number;
    maxCapacity: number;
    image: string;
    description: string;
    amenities: string[];
    ownerName: string;
    ownerEmail: string;
}

export default function EditStudioForm() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const router = useRouter();

    const { data: session, isPending: sessionLoading } =
        authClient.useSession();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        location: "",
        price: "",
        securityDeposit: "",
        maxCapacity: "",
        image: "",
        description: "",
        amenities: [] as string[],
    });

    const [ownerName, setOwnerName] = useState("");
    const [ownerEmail, setOwnerEmail] = useState("");

    // Load studio information
    useEffect(() => {
        if (sessionLoading) return;

        if (!session?.user) {
            router.replace("/login");
            return;
        }

        let cancelled = false;

        const fetchStudio = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/studios/${id}`,
                    {
                        credentials: "include",
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to load studio."
                    );
                }

                const studio: Studio = result.studio || result.data || result;

                if (cancelled) return;

                // Only the studio owner can edit this studio
                if (
                    studio.ownerEmail?.toLowerCase() !==
                    session.user.email?.toLowerCase()
                ) {
                    setError(
                        "You are not authorized to edit this studio."
                    );
                    return;
                }

                setFormData({
                    name: studio.name || "",
                    category: studio.category || "",
                    location: studio.location || "",
                    price: String(studio.price ?? ""),
                    securityDeposit: String(
                        studio.securityDeposit ?? ""
                    ),
                    maxCapacity: String(studio.maxCapacity ?? ""),
                    image: studio.image || "",
                    description: studio.description || "",
                    amenities: studio.amenities || [],
                });

                setOwnerName(studio.ownerName || session.user.name || "");
                setOwnerEmail(studio.ownerEmail || session.user.email || "");
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

        fetchStudio();

        return () => {
            cancelled = true;
        };
    }, [id, session, sessionLoading, router]);

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleAmenityChange = (amenity: string) => {
        setFormData((previous) => ({
            ...previous,
            amenities: previous.amenities.includes(amenity)
                ? previous.amenities.filter((item) => item !== amenity)
                : [...previous.amenities, amenity],
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.name.trim() || !formData.category ||
            !formData.location.trim() || !formData.image.trim() ||
            !formData.description.trim()) {
            setError("Please complete all required fields.");
            return;
        }

        const price = Number(formData.price);
        const securityDeposit = Number(formData.securityDeposit);
        const maxCapacity = Number(formData.maxCapacity);

        if (
            !Number.isFinite(price) ||
            !Number.isFinite(securityDeposit) ||
            !Number.isFinite(maxCapacity) ||
            price <= 0 ||
            securityDeposit < 0 ||
            maxCapacity < 1
        ) {
            setError("Please enter valid price, deposit and capacity.");
            return;
        }

        try {
            setSubmitting(true);

            const response = await fetch(
                `${API_URL}/api/studios/${id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        category: formData.category,
                        location: formData.location.trim(),
                        price,
                        securityDeposit,
                        maxCapacity,
                        image: formData.image.trim(),
                        description: formData.description.trim(),
                        amenities: formData.amenities,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to update studio."
                );
            }

            setSuccess("Studio updated successfully!");

            setTimeout(() => {
                router.push("/my-listings");
                router.refresh();
            }, 1000);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while updating."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-[#b8d1bf] bg-[#edf5ef] px-4 py-3 text-[#18352a] outline-none transition placeholder:text-[#718477] focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/20 dark:border-[#263d32] dark:bg-[#14251f] dark:text-[#e5f2e9] dark:placeholder:text-[#a7b9ae] dark:focus:border-[#34d399]";

    const labelClass =
        "mb-2 block text-sm font-semibold text-[#18352a] dark:text-[#e5f2e9]";

    if (sessionLoading || loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#b8d1bf] border-t-[#166534] dark:border-[#263d32] dark:border-t-[#34d399]" />
                    <p className="mt-4 font-medium text-[#40594b] dark:text-[#a7b9ae]">
                        Loading studio information...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !formData.name) {
        return (
            <div className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 dark:border-red-900 dark:bg-red-950/30">
                    <h2 className="text-xl font-bold text-red-700 dark:text-red-400">
                        Unable to Edit Studio
                    </h2>

                    <p className="mt-3 text-sm text-red-600 dark:text-red-300">
                        {error}
                    </p>

                    <Link
                        href="/my-listings"
                        className="mt-6 inline-flex rounded-xl bg-[#166534] px-6 py-3 font-semibold text-white transition hover:bg-[#14532d] dark:bg-[#166534] dark:hover:bg-[#14532d]"
                    >
                        Back to My Listings
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-[#dcebe0] px-4 py-12 dark:bg-[#0b0f0d]">
            <div className="mx-auto max-w-4xl">
                {/* Heading */}
                <div className="mb-8">
                    <Link
                        href="/my-listings"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#166534] hover:text-[#14532d] dark:text-[#34d399] dark:hover:text-[#6ee7b7]"
                    >
                        ← Back to My Listings
                    </Link>

                    <h1 className="text-3xl font-bold text-[#18352a] sm:text-4xl dark:text-[#e5f2e9]">
                        Edit Your Studio
                    </h1>

                    <p className="mt-3 text-[#52665b] dark:text-[#a7b9ae]">
                        Update your studio information and keep your listing
                        accurate.
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-3xl border border-[#b8d1bf] bg-[#edf5ef] p-5 shadow-sm sm:p-8 dark:border-[#263d32] dark:bg-[#14251f]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Studio Name */}
                        <div>
                            <label className={labelClass}>
                                Studio Name *
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter studio name"
                                className={inputClass}
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className={labelClass}>
                                Category *
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            >
                                <option value="">Select a category</option>

                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Location */}
                        <div>
                            <label className={labelClass}>
                                Location *
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Enter studio address"
                                className={inputClass}
                                required
                            />
                        </div>

                        {/* Price and Deposit */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    Hourly Rate ($) *
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    min="1"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="1500"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Security Deposit ($) *
                                </label>

                                <input
                                    type="number"
                                    name="securityDeposit"
                                    min="0"
                                    value={formData.securityDeposit}
                                    onChange={handleChange}
                                    placeholder="2000"
                                    className={inputClass}
                                    required
                                />
                            </div>
                        </div>

                        {/* Capacity */}
                        <div>
                            <label className={labelClass}>
                                Maximum Capacity *
                            </label>

                            <input
                                type="number"
                                name="maxCapacity"
                                min="1"
                                value={formData.maxCapacity}
                                onChange={handleChange}
                                placeholder="20"
                                className={inputClass}
                                required
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className={labelClass}>
                                Studio Image URL *
                            </label>

                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/studio.jpg"
                                className={inputClass}
                                required
                            />

                            {formData.image && (
                                <div className="mt-4 overflow-hidden rounded-2xl border border-[#b8d1bf] dark:border-[#263d32]">
                                    <img
                                        src={formData.image}
                                        alt="Studio preview"
                                        className="h-56 w-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Amenities */}
                        <div>
                            <label className={labelClass}>
                                Studio Amenities
                            </label>

                            <p className="mb-4 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                                Select the facilities available in your studio.
                            </p>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {availableAmenities.map((amenity) => (
                                    <label
                                        key={amenity}
                                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#b8d1bf] bg-[#f7fbf8] p-3 text-sm text-[#18352a] transition hover:border-[#166534] dark:border-[#263d32] dark:bg-[#1b3428] dark:text-[#e5f2e9] dark:hover:border-[#34d399]"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.amenities.includes(
                                                amenity
                                            )}
                                            onChange={() =>
                                                handleAmenityChange(amenity)
                                            }
                                            className="h-4 w-4 accent-[#166534]"
                                        />

                                        {amenity}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className={labelClass}>
                                Studio Description *
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your studio, facilities and services..."
                                rows={6}
                                className={`${inputClass} resize-y`}
                                required
                            />
                        </div>

                        {/* Host Information */}
                        <div className="rounded-2xl border border-[#b8d1bf] bg-[#dcebe0] p-5 dark:border-[#263d32] dark:bg-[#0b0f0d]">
                            <h3 className="mb-4 font-bold text-[#18352a] dark:text-[#e5f2e9]">
                                Host Information
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={labelClass}>
                                        Host Name
                                    </label>

                                    <input
                                        type="text"
                                        value={ownerName}
                                        readOnly
                                        className={`${inputClass} cursor-not-allowed opacity-75`}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Host Email
                                    </label>

                                    <input
                                        type="email"
                                        value={ownerEmail}
                                        readOnly
                                        className={`${inputClass} cursor-not-allowed opacity-75`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Feedback */}
                        {error && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                            >
                                {error}
                            </div>
                        )}

                        {success && (
                            <div
                                role="status"
                                className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300"
                            >
                                {success}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col-reverse gap-3 border-t border-[#b8d1bf] pt-6 sm:flex-row sm:justify-end dark:border-[#263d32]">
                            <Link
                                href="/my-listings"
                                className="rounded-xl border border-[#b8d1bf] px-6 py-3 text-center font-semibold text-[#18352a] transition hover:bg-[#dcebe0] dark:border-[#263d32] dark:text-[#e5f2e9] dark:hover:bg-[#1b3428]"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-xl bg-[#166534] px-7 py-3 font-semibold text-white transition hover:bg-[#14532d] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting
                                    ? "Updating Studio..."
                                    : "Update Studio"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
