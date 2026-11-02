"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
    ArrowLeft,
    Image as ImageIcon,
    Loader2,
    UploadCloud,
    X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import API_URL, { getAuthHeaders } from "@/lib/api";

const categories = [
    "Photo Studios",
    "Sound Stages",
    "Podcast Rooms",
    "Music Suites",
    "Art Workshops",
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
    const [uploadingImage, setUploadingImage] = useState(false);
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

    // ImgBB Image Upload
    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file.");
            return;
        }

        try {
            setUploadingImage(true);
            const uploadData = new FormData();
            uploadData.append("image", file);

            const response = await fetch(
                "https://api.imgbb.com/1/upload?key=7ed5039a9aa04fbe32ef10f6e7ad786d",
                {
                    method: "POST",
                    body: uploadData,
                }
            );

            const result = await response.json();

            if (result.success && result.data?.url) {
                const uploadedUrl = result.data.display_url || result.data.url;
                setFormData((prev) => ({
                    ...prev,
                    image: uploadedUrl,
                }));
                toast.success("Image uploaded successfully via ImgBB!");
            } else {
                throw new Error(
                    result.error?.message || "Failed to upload image to ImgBB."
                );
            }
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Image upload failed."
            );
        } finally {
            setUploadingImage(false);
        }
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
                        ...getAuthHeaders(),
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

            toast.success("Studio updated successfully!");
            setSuccess("Studio updated successfully!");

            setTimeout(() => {
                router.push("/my-listings");
                router.refresh();
            }, 1000);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong while updating.";
            setError(message);
            toast.error(message);
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
        <section className="min-h-screen bg-[#dcebe0] px-4 py-12 text-[#18352a] transition-colors dark:bg-[#0b0f0d] dark:text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {/* Back button */}
                <Link
                    href="/my-listings"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#166534] transition hover:text-[#14532d] dark:text-[#34d399] dark:hover:text-[#6ee7b7]"
                >
                    <ArrowLeft size={16} />
                    Back to My Listings
                </Link>

                <div className="rounded-3xl border border-[#b8d1bf] bg-white p-6 shadow-xl dark:border-[#263d32] dark:bg-[#14251f] sm:p-10">
                    <div className="mb-8 border-b border-[#b8d1bf] pb-6 dark:border-[#263d32]">
                        <h1 className="text-3xl font-bold">Edit Studio</h1>
                        <p className="mt-2 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                            Update your studio specifications and details.
                        </p>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                        >
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            role="status"
                            className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300"
                        >
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Host Information (Read Only) */}
                        <div className="rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-5 dark:border-[#263d32] dark:bg-[#0b0f0d]/50">
                            <h2 className="mb-4 text-base font-bold text-[#18352a] dark:text-[#e5f2e9]">
                                Host Information (Read-Only)
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={labelClass}>
                                        Host Name
                                    </label>
                                    <input
                                        type="text"
                                        value={ownerName}
                                        readOnly
                                        disabled
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
                                        disabled
                                        className={`${inputClass} cursor-not-allowed opacity-75`}
                                    />
                                </div>
                            </div>
                        </div>

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
                                placeholder="Studio Name"
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
                                <option value="" disabled>
                                    Select a category
                                </option>
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
                                Location / Address *
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Dhanmondi, Dhaka"
                                className={inputClass}
                                required
                            />
                        </div>

                        {/* Pricing & Capacity Grid */}
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <label className={labelClass}>
                                    Price / Hour ($) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    min="1"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="50"
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
                                    placeholder="100"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Max Capacity *
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
                        </div>

                        {/* Image Upload with ImgBB */}
                        <div className="rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-5 dark:border-[#263d32] dark:bg-[#0b0f0d]/50">
                            <label className={labelClass}>
                                Studio Image (Upload via ImgBB or Enter URL) *
                            </label>

                            {/* ImgBB Upload input */}
                            <div className="mb-4">
                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#b8d1bf] bg-white/70 p-4 transition hover:border-[#166534] dark:border-[#263d32] dark:bg-[#14251f]/50 dark:hover:border-[#34d399]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImage}
                                        className="hidden"
                                    />
                                    {uploadingImage ? (
                                        <div className="flex items-center gap-2 text-sm text-[#166534] dark:text-[#34d399]">
                                            <Loader2 size={20} className="animate-spin" />
                                            <span>Uploading image to ImgBB...</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1.5 text-center text-sm text-[#52735e] dark:text-[#8da99a]">
                                            <UploadCloud size={24} className="text-[#166534] dark:text-[#34d399]" />
                                            <span className="font-semibold text-[#18352a] dark:text-white">
                                                Upload replacement image via ImgBB
                                            </span>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Direct URL input */}
                            <div>
                                <span className="mb-2 block text-xs font-semibold text-[#52735e] dark:text-[#8da99a]">
                                    Or update image URL directly:
                                </span>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://i.ibb.co/studio.jpg"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            {/* Preview */}
                            {formData.image && (
                                <div className="mt-4 flex items-center gap-4 rounded-xl border border-[#b8d1bf] bg-white p-3 dark:border-[#263d32] dark:bg-[#14251f]">
                                    <img
                                        src={formData.image}
                                        alt="Studio preview"
                                        className="h-20 w-32 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-xs font-medium text-[#18352a] dark:text-white">
                                            {formData.image}
                                        </p>
                                        <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                                            ✓ Current Studio Image
                                        </span>
                                    </div>
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
                                rows={5}
                                placeholder="Describe your creative space..."
                                className={`${inputClass} resize-none`}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
                            <Link
                                href="/my-listings"
                                className="rounded-xl border border-[#b8d1bf] px-6 py-3 text-center font-semibold text-[#18352a] transition hover:bg-[#edf5ef] dark:border-[#263d32] dark:text-[#e5f2e9] dark:hover:bg-[#14251f]"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={submitting || uploadingImage}
                                className="rounded-xl bg-[#166534] px-8 py-3 font-semibold text-white transition hover:bg-[#14532d] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                            >
                                {submitting ? "Saving Changes..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
