
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
    AudioLines,
    User,
    Mail,
    Lock,
    Image as ImageIcon,
    ArrowRight,
    Eye,
    EyeOff,
} from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [photo, setPhoto] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
                callbackURL: "/",
            });

            if (error) {
                setError(error.message || "Registration failed. Please try again.");
                return;
            }

            router.push("/");
            router.refresh();
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#dcebe0] px-5 py-16 text-[#18352a] transition-colors dark:bg-[#0b0f0d] dark:text-white">
            <div className="w-full max-w-md">
                <Link href="/" className="mb-8 flex items-center justify-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#34d399] to-[#166534] text-white shadow-lg shadow-green-900/20">
                        <AudioLines size={27} />
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

                        {/* Photo URL */}
                        <div>
                            <label
                                htmlFor="photo"
                                className="mb-2 block text-sm font-medium text-[#294b38] dark:text-[#d5e5da]"
                            >
                                Photo URL
                            </label>

                            <div className="flex items-center rounded-lg border border-[#b8d1bf] bg-white px-3 transition focus-within:border-[#166534] dark:border-[#263d32] dark:bg-[#0b0f0d] dark:focus-within:border-[#34d399]">
                                <ImageIcon size={18} className="shrink-0 text-[#52735e] dark:text-[#8da99a]" />

                                <input
                                    id="photo"
                                    type="url"
                                    value={photo}
                                    onChange={(e) => setPhoto(e.target.value)}
                                    placeholder="https://example.com/photo.jpg"
                                    className="w-full bg-transparent px-3 py-3 text-sm text-[#18352a] outline-none placeholder:text-[#819488] dark:text-white dark:placeholder:text-[#71877a]"
                                />
                            </div>
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
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#166534] py-3 font-semibold text-white shadow-md shadow-green-900/15 transition hover:bg-[#14532d] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                        >
                            {loading ? "Creating Account..." : "Create Account"}

                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

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
        </main>
    );
}
