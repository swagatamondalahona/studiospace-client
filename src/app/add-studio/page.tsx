
"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
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
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/studios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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

            setSuccess(data?.message || "Studio added successfully!");

            setTimeout(() => {
                router.push("/my-listings");
                router.refresh();
            }, 1200);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-lg border border-[#b8d1bf] bg-white px-4 py-3 text-sm text-[#18352a] outline-none transition placeholder:text-[#819488] focus:border-[#166534] dark:border-[#263d32] dark:bg-[#0b0f0d] dark:text-white dark:placeholder:text-[#71877a] dark:focus:border-[#34d399]";

    const labelClass =
        "mb-2 block text-sm font-medium text-[#294b38] dark:text-[#d5e5da]";

    if (sessionLoading || !session?.user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#dcebe0] dark:bg-[#0b0f0d]">
                <Loader2
                    className="animate-spin text-[#166534] dark:text-[#34d399]"
                    size={32}
                />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#dcebe0] px-5 py-12 text-[#18352a] transition-colors dark:bg-[#0b0f0d] dark:text-white">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/"
                    className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#166534] transition hover:text-[#14532d] dark:text-[#34d399] dark:hover:text-[#6ee7b7]"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                <div className="rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-6 shadow-xl shadow-green-950/10 sm:p-9 dark:border-[#263d32] dark:bg-[#14251f]">
                    <div className="mb-8">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#166534] text-white dark:bg-[#34d399] dark:text-[#0b0f0d]">
                            <Building2 size={25} />
                        </div>

                        <h1 className="text-3xl font-bold">
                            Add Your Studio
                        </h1>

                        <p className="mt-2 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                            Share your creative space with the StudioSpace community.
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
                                Host Information
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
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
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
                                    placeholder="e.g. Dhaka, Bangladesh"
                                    className={`${inputClass} pl-10`}
                                />
                            </div>
                        </div>

                        {/* Price, Deposit and Capacity */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="price" className={labelClass}>
                                    Price per Hour (৳)
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
                                        placeholder="e.g. 1500"
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="securityDeposit"
                                    className={labelClass}
                                >
                                    Security Deposit (৳)
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
                                        placeholder="e.g. 2000"
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

                        {/* Image URL */}
                        <div>
                            <label htmlFor="image" className={labelClass}>
                                Studio Image URL
                            </label>
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
                                    placeholder="https://example.com/studio.jpg"
                                    className={`${inputClass} pl-10`}
                                />
                            </div>
                            <p className="mt-2 text-xs text-[#52665b] dark:text-[#8da99a]">
                                Paste a publicly accessible studio image URL.
                            </p>
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
                            disabled={loading}
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
        </main>
    );
}
