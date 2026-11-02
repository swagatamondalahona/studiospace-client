"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
    Aperture,
    User,
    Mail,
    Lock,
    Image as ImageIcon,
    ArrowRight,
    Eye,
    EyeOff,
    UploadCloud,
    Loader2,
    X,
} from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [photo, setPhoto] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [error, setError] = useState("");

    // ImgBB Profile Photo Upload Handler
    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file.");
            return;
        }

        try {
            setUploadingPhoto(true);
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
                setPhoto(uploadedUrl);
                toast.success("Profile photo uploaded successfully via ImgBB!");
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
            setUploadingPhoto(false);
        }
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            setError("Password must contain at least one uppercase letter.");
            return;
        }

        if (!/[a-z]/.test(password)) {
            setError("Password must contain at least one lowercase letter.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await authClient.signUp.email({
                name,
                email,
                password,
                image: photo || undefined,
                callbackURL: "/login",
            });

            if (error) {
                setError(error.message || "Registration failed. Please try again.");
                return;
            }

            toast.success("Account created successfully! Please sign in.");
            router.push("/login");
            router.refresh();
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setError("");
        setLoading(true);

        try {
            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: `${window.location.origin}/`,
            });

            if (error) {
                console.error("Google Signup Error:", error);
                setError(error.message || "Google signup failed.");
                setLoading(false);
            }
        } catch (err) {
            console.error("Google Signup Error:", err);
            setError("Google signup failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <section className="flex min-h-screen items-center justify-center bg-[#dcebe0] px-5 py-16 text-[#18352a] transition-colors dark:bg-[#0b0f0d] dark:text-white">
            <div className="w-full max-w-md">
                <Link href="/" className="mb-8 flex items-center justify-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#34d399] to-[#166534] text-white shadow-lg shadow-green-900/20">
                        <Aperture size={27} />
                    </span>

                    <span className="text-2xl font-bold text-[#18352a] dark:text-white">
                        Studio<span className="text-[#166534] dark:text-[#34d399]">Space</span>
                    </span>
                </Link>

                <div className="rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-7 shadow-2xl shadow-green-950/10 sm:p-9 dark:border-[#263d32] dark:bg-[#14251f]">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-[#18352a] dark:text-white">
                            Create Account
                        </h1>

                        <p className="mt-2 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                            Join StudioSpace and explore creative spaces
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-[#294b38] dark:text-[#d5e5da]"
                            >
                                Full Name
                            </label>

                            <div className="flex items-center rounded-lg border border-[#b8d1bf] bg-white px-3 transition focus-within:border-[#166534] dark:border-[#263d32] dark:bg-[#0b0f0d] dark:focus-within:border-[#34d399]">
                                <User size={18} className="shrink-0 text-[#52735e] dark:text-[#8da99a]" />

                                <input
                                    id="name"
                                    type="text"
                                    required
                                    autoComplete="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full bg-transparent px-3 py-3 text-sm text-[#18352a] outline-none placeholder:text-[#819488] dark:text-white dark:placeholder:text-[#71877a]"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-[#294b38] dark:text-[#d5e5da]"
                            >
                                Email Address
                            </label>

                            <div className="flex items-center rounded-lg border border-[#b8d1bf] bg-white px-3 transition focus-within:border-[#166534] dark:border-[#263d32] dark:bg-[#0b0f0d] dark:focus-within:border-[#34d399]">
                                <Mail size={18} className="shrink-0 text-[#52735e] dark:text-[#8da99a]" />

                                <input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-transparent px-3 py-3 text-sm text-[#18352a] outline-none placeholder:text-[#819488] dark:text-white dark:placeholder:text-[#71877a]"
                                />
                            </div>
                        </div>

                        {/* Profile Photo (ImgBB Upload or Direct URL) */}
                        <div className="rounded-xl border border-[#b8d1bf] bg-white/70 p-4 dark:border-[#263d32] dark:bg-[#0b0f0d]/50">
                            <label className="mb-2 block text-sm font-medium text-[#294b38] dark:text-[#d5e5da]">
                                Profile Photo (ImgBB Upload or URL)
                            </label>

                            {/* Upload via ImgBB */}
                            <div className="mb-3">
                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#b8d1bf] bg-white/80 p-4 transition hover:border-[#166534] dark:border-[#263d32] dark:bg-[#14251f]/40 dark:hover:border-[#34d399]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        disabled={uploadingPhoto}
                                        className="hidden"
                                    />
                                    {uploadingPhoto ? (
                                        <div className="flex items-center gap-2 text-sm text-[#166534] dark:text-[#34d399]">
                                            <Loader2 size={20} className="animate-spin" />
                                            <span>Uploading photo to ImgBB...</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1.5 text-center text-xs text-[#52735e] dark:text-[#8da99a]">
                                            <UploadCloud size={24} className="text-[#166534] dark:text-[#34d399]" />
                                            <span className="font-semibold text-[#18352a] dark:text-white">
                                                Click to upload photo to ImgBB
                                            </span>
                                            <span className="text-[11px] text-[#819488] dark:text-[#71877a]">
                                                JPG, PNG, WEBP (Direct ImgBB integration)
                                            </span>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Direct URL Fallback */}
                            <div className="flex items-center rounded-lg border border-[#b8d1bf] bg-white px-3 transition focus-within:border-[#166534] dark:border-[#263d32] dark:bg-[#0b0f0d] dark:focus-within:border-[#34d399]">
                                <ImageIcon size={18} className="shrink-0 text-[#52735e] dark:text-[#8da99a]" />

                                <input
                                    id="photo"
                                    type="url"
                                    value={photo}
                                    onChange={(e) => setPhoto(e.target.value)}
                                    placeholder="Or paste photo URL directly"
                                    className="w-full bg-transparent px-3 py-2.5 text-sm text-[#18352a] outline-none placeholder:text-[#819488] dark:text-white dark:placeholder:text-[#71877a]"
                                />
                            </div>

                            {/* Photo Preview & Remove */}
                            {photo && (
                                <div className="mt-3 flex items-center justify-between rounded-lg border border-[#b8d1bf] bg-white p-2.5 shadow-sm dark:border-[#263d32] dark:bg-[#14251f]">
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#166534] dark:border-[#34d399]">
                                            <Image
                                                src={photo}
                                                alt="Profile Preview"
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-[#18352a] dark:text-white">
                                                Photo Preview
                                            </p>
                                            <p className="truncate text-[11px] text-[#52735e] dark:text-[#8da99a]">
                                                {photo}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPhoto("")}
                                        className="shrink-0 rounded-md p-1.5 text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                                        title="Remove photo"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-[#294b38] dark:text-[#d5e5da]"
                            >
                                Password
                            </label>

                            <div className="flex items-center rounded-lg border border-[#b8d1bf] bg-white px-3 transition focus-within:border-[#166534] dark:border-[#263d32] dark:bg-[#0b0f0d] dark:focus-within:border-[#34d399]">
                                <Lock size={18} className="shrink-0 text-[#52735e] dark:text-[#8da99a]" />

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    className="w-full bg-transparent px-3 py-3 text-sm text-[#18352a] outline-none placeholder:text-[#819488] dark:text-white dark:placeholder:text-[#71877a]"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="ml-2 shrink-0 text-[#52735e] transition hover:text-[#166534] dark:text-[#8da99a] dark:hover:text-[#34d399]"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>

                            <p className="mt-2 text-xs text-[#52665b] dark:text-[#8da99a]">
                                Must include uppercase and lowercase letters.
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || uploadingPhoto}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#166534] py-3 font-semibold text-white shadow-md shadow-green-900/15 transition hover:bg-[#14532d] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                        >
                            {loading ? "Creating Account..." : "Create Account"}

                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-[#b8d1bf] dark:bg-[#365343]" />

                        <span className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
                            OR REGISTER WITH
                        </span>

                        <div className="h-px flex-1 bg-[#b8d1bf] dark:bg-[#365343]" />
                    </div>

                    {/* Google Sign-in */}
                    <button
                        type="button"
                        onClick={handleGoogleRegister}
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#b8d1bf] bg-white py-3 text-sm font-medium text-[#18352a] transition hover:bg-[#f7fbf8] disabled:opacity-60 dark:border-[#365343] dark:bg-[#0b0f0d] dark:text-white dark:hover:bg-[#1b3428]"
                    >
                        <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.06 13.22l7.98 6.19C12.93 13.72 18.04 9.5 24 9.5Z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 38.05 46.98 31.9 46.98 24.55Z" />
                            <path fill="#FBBC05" d="M10.04 28.59A14.4 14.4 0 0 1 9.27 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.48-6.19Z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-5.96 0-11.07-4.22-12.96-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
                        </svg>

                        Continue with Google
                    </button>

                    <p className="mt-7 text-center text-sm text-[#52665b] dark:text-[#a7b9ae]">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-[#166534] transition hover:text-[#14532d] dark:text-[#34d399] dark:hover:text-[#6ee7b7]"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-[#52665b] dark:text-[#71877a]">
                    © 2026 StudioSpace. All rights reserved.
                </p>
            </div>
        </section>
    );
}
