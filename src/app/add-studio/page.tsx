"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
    ArrowLeft,
    Image as ImageIcon,
    MapPin,
    DollarSign,
    Building2,
    Tag,
    FileText,
    Loader2,
    User,
    Users,
    ShieldCheck,
    Check,
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

export default function AddStudioPage() {
    const router = useRouter();

    const { data: session, isPending: sessionLoading } =
        authClient.useSession();

    // Redirect unauthenticated users to Login
    useEffect(() => {
        if (!sessionLoading && !session?.user) {
            router.replace(
                `/login?callbackURL=${encodeURIComponent("/add-studio")}`
            );
        }
    }, [sessionLoading, session, router]);

    const [loading, setLoading] = useState(false);
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

    const userName = session?.user?.name || "";
    const userEmail = session?.user?.email || "";

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAmenityChange = (amenity: string) => {
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((item) => item !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    // ImgBB Image Upload Handler
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!session?.user) {
            setError("Please login before adding a studio.");
            return;
        }

        if (
            Number(formData.price) <= 0 ||
            Number(formData.securityDeposit) < 0 ||
            Number(formData.maxCapacity) < 1
        ) {
            setError("Please enter valid price, deposit and capacity values.");
            return;
        }

        if (!formData.image.trim()) {
            setError("Please upload an image or provide an image URL.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/studios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                credentials: "include",
                body: JSON.stringify({
                    name: formData.name,
                    category: formData.category,
                    location: formData.location,
                    price: Number(formData.price),
                    securityDeposit: Number(formData.securityDeposit),
                    maxCapacity: Number(formData.maxCapacity),
                    image: formData.image,
                    description: formData.description,
                    amenities: formData.amenities,
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    `Failed to add studio. Status: ${response.status}`
                );
            }

            toast.success(data?.message || "Studio added successfully!");
            setSuccess(data?.message || "Studio added successfully!");

            setTimeout(() => {
                router.push("/my-listings");
                router.refresh();
            }, 1000);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Something went wrong.";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-lg border border-[#b8d1bf] bg-white px-4 py-3 text-sm text-[#18352a] outline-none transition focus:border-[#166534] dark:border-[#263d32] dark:bg-[#0b0f0d] dark:text-white dark:focus:border-[#34d399]";

    const labelClass =
        "mb-2 block text-sm font-medium text-[#294b38] dark:text-[#d5e5da]";

    return (
        <section className="min-h-screen bg-[#dcebe0] px-5 py-12 text-[#18352a] transition-colors dark:bg-[#0b0f0d] dark:text-white sm:px-8">
            <div className="mx-auto max-w-3xl">
                {/* Back Link */}
                <Link
                    href="/my-listings"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#166534] transition hover:text-[#14532d] dark:text-[#34d399] dark:hover:text-[#6ee7b7]"
                >
                    <ArrowLeft size={16} />
                    Back to My Listings
                </Link>

                <div className="rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-6 shadow-xl dark:border-[#263d32] dark:bg-[#14251f] sm:p-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Add New Studio</h1>
                        <p className="mt-2 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                            List your creative space and start welcoming creators
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-5 rounded-lg border border-green-600/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-300">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Host Information */}
                        <div className="rounded-xl border border-[#b8d1bf] bg-white/70 p-4 dark:border-[#263d32] dark:bg-[#0b0f0d]/50">
                            <h2 className="mb-4 flex items-center gap-2 font-semibold">
                                <User size={18} />
                                Host Information (Read-Only)
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={labelClass}>
                                        Host Name
                                    </label>
                                    <input
                                        value={userName}
                                        readOnly
                                        className={`${inputClass} cursor-not-allowed opacity-75`}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Host Email
                                    </label>
                                    <input
                                        value={userEmail}
                                        readOnly
                                        className={`${inputClass} cursor-not-allowed opacity-75`}
                                    />
                                </div>
                            </div>

                            <p className="mt-3 text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                Your account information is linked automatically.
                            </p>
                        </div>

                        {/* Studio Name */}
                        <div>
                            <label htmlFor="name" className={labelClass}>
                                Studio Name
                            </label>
                            <div className="relative">
                                <Building2
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52735e] dark:text-[#8da99a]"
                                />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter studio name"
                                    className={`${inputClass} pl-10`}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className={labelClass}>
                                Studio Category
                            </label>
                            <div className="relative">
                                <Tag
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52735e] dark:text-[#8da99a]"
                                />
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10`}
                                >
                                    <option value="" disabled>
                                        Select category
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className={labelClass}>
                                Location / Address
                            </label>
                            <div className="relative">
                                <MapPin
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52735e] dark:text-[#8da99a]"
                                />
                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Dhanmondi, Dhaka"
                                    className={`${inputClass} pl-10`}
                                />
                            </div>
                        </div>

                        {/* Pricing & Capacity Grid */}
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <label htmlFor="price" className={labelClass}>
                                    Hourly Rate ($)
                                </label>
                                <div className="relative">
                                    <DollarSign
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52735e] dark:text-[#8da99a]"
                                    />
                                    <input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="1"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="e.g. 50"
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="securityDeposit"
                                    className={labelClass}
                                >
                                    Security Deposit ($)
                                </label>
                                <div className="relative">
                                    <ShieldCheck
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52735e] dark:text-[#8da99a]"
                                    />
                                    <input
                                        id="securityDeposit"
                                        name="securityDeposit"
                                        type="number"
                                        min="0"
                                        required
                                        value={formData.securityDeposit}
                                        onChange={handleChange}
                                        placeholder="e.g. 100"
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="maxCapacity"
                                    className={labelClass}
                                >
                                    Maximum Capacity (People)
                                </label>
                                <div className="relative">
                                    <Users
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52735e] dark:text-[#8da99a]"
                                    />
                                    <input
                                        id="maxCapacity"
                                        name="maxCapacity"
                                        type="number"
                                        min="1"
                                        required
                                        value={formData.maxCapacity}
                                        onChange={handleChange}
                                        placeholder="e.g. 20"
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image Upload System (ImgBB Integrated) */}
                        <div className="rounded-xl border border-[#b8d1bf] bg-white/70 p-4 dark:border-[#263d32] dark:bg-[#0b0f0d]/50">
                            <label className={labelClass}>
                                Studio Image (Upload via ImgBB or Enter URL)
                            </label>

                            {/* Upload via ImgBB */}
                            <div className="mb-4">
                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#b8d1bf] bg-white/60 p-5 transition hover:border-[#166534] dark:border-[#263d32] dark:bg-[#14251f]/40 dark:hover:border-[#34d399]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImage}
                                        className="hidden"
                                    />
                                    {uploadingImage ? (
                                        <div className="flex flex-col items-center gap-2 text-sm text-[#166534] dark:text-[#34d399]">
                                            <Loader2 size={24} className="animate-spin" />
                                            <span>Uploading image to ImgBB...</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-center text-sm text-[#52735e] dark:text-[#8da99a]">
                                            <UploadCloud size={28} className="text-[#166534] dark:text-[#34d399]" />
                                            <span className="font-semibold text-[#18352a] dark:text-white">
                                                Click to upload image to ImgBB
                                            </span>
                                            <span className="text-xs">
                                                Supports JPG, PNG, WEBP (Direct ImgBB integration)
                                            </span>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Direct URL Fallback */}
                            <div>
                                <span className="mb-2 block text-xs font-semibold text-[#52735e] dark:text-[#8da99a]">
                                    Or paste direct Image URL:
                                </span>
                                <div className="relative">
                                    <ImageIcon
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52735e] dark:text-[#8da99a]"
                                    />
                                    <input
                                        id="image"
                                        name="image"
                                        type="url"
                                        required
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="https://i.ibb.co/example.jpg"
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>
                            </div>

                            {/* Uploaded Preview */}
                            {formData.image && (
                                <div className="mt-4 flex items-center gap-4 rounded-lg border border-[#b8d1bf] bg-white p-3 dark:border-[#263d32] dark:bg-[#14251f]">
                                    <img
                                        src={formData.image}
                                        alt="Studio preview"
                                        className="h-16 w-24 rounded object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-xs font-medium text-[#18352a] dark:text-white">
                                            {formData.image}
                                        </p>
                                        <span className="text-[11px] font-semibold text-green-700 dark:text-green-400">
                                            ✓ Ready for submission
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({ ...prev, image: "" }))
                                        }
                                        className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                        title="Remove image"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Amenities */}
                        <div>
                            <label className={labelClass}>
                                Studio Amenities
                            </label>
                            <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#b8d1bf] bg-white/60 p-4 sm:grid-cols-2 dark:border-[#263d32] dark:bg-[#0b0f0d]/40">
                                {availableAmenities.map((amenity) => {
                                    const selected =
                                        formData.amenities.includes(amenity);

                                    return (
                                        <label
                                            key={amenity}
                                            className="flex cursor-pointer items-center gap-3 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                onChange={() =>
                                                    handleAmenityChange(amenity)
                                                }
                                                className="sr-only"
                                            />
                                            <span
                                                className={`flex h-5 w-5 items-center justify-center rounded border ${selected
                                                        ? "border-[#166534] bg-[#166534] text-white dark:border-[#34d399] dark:bg-[#34d399] dark:text-[#0b0f0d]"
                                                        : "border-[#9ab5a2] bg-white dark:border-[#52665b] dark:bg-[#14251f]"
                                                    }`}
                                            >
                                                {selected && <Check size={14} />}
                                            </span>
                                            <span>{amenity}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className={labelClass}
                            >
                                Studio Description
                            </label>
                            <div className="relative">
                                <FileText
                                    size={18}
                                    className="absolute left-3 top-4 text-[#52735e] dark:text-[#8da99a]"
                                />
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your studio, facilities and available equipment..."
                                    className={`${inputClass} resize-none pl-10`}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || uploadingImage}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#166534] py-3.5 font-semibold text-white transition hover:bg-[#14532d] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={19}
                                        className="animate-spin"
                                    />
                                    Adding Studio...
                                </>
                            ) : (
                                <>
                                    Add Studio
                                    <ArrowLeft
                                        size={18}
                                        className="rotate-180"
                                    />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
