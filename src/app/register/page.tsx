
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
} from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [photo, setPhoto] = useState("");
    const [password, setPassword] = useState("");
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
        <main className="flex min-h-screen items-center justify-center bg-[#030712] px-5 py-16 text-white">
            <div className="w-full max-w-md">
                <Link href="/" className="mb-8 flex items-center justify-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-700">
                        <AudioLines size={27} />
                    </span>
                    <span className="text-2xl font-bold">
                        Studio<span className="text-blue-400">Space</span>
                    </span>
                </Link>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl sm:p-9">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold">Create Account</h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Join StudioSpace and explore creative spaces
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">
                                Full Name
                            </label>
                            <div className="flex items-center rounded-lg border border-white/10 bg-white/5 px-3 focus-within:border-blue-500">
                                <User size={18} className="text-slate-500" />
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    autoComplete="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                                Email Address
                            </label>
                            <div className="flex items-center rounded-lg border border-white/10 bg-white/5 px-3 focus-within:border-blue-500">
                                <Mail size={18} className="text-slate-500" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="photo" className="mb-2 block text-sm font-medium text-slate-300">
                                Photo URL
                            </label>
                            <div className="flex items-center rounded-lg border border-white/10 bg-white/5 px-3 focus-within:border-blue-500">
                                <ImageIcon size={18} className="text-slate-500" />
                                <input
                                    id="photo"
                                    type="url"
                                    value={photo}
                                    onChange={(e) => setPhoto(e.target.value)}
                                    placeholder="https://example.com/photo.jpg"
                                    className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
                                Password
                            </label>
                            <div className="flex items-center rounded-lg border border-white/10 bg-white/5 px-3 focus-within:border-blue-500">
                                <Lock size={18} className="text-slate-500" />
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-500"
                                />
                            </div>
                            <p className="mt-2 text-xs text-slate-500">
                                Must include uppercase and lowercase letters.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300">
                            Sign In
                        </Link>
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                    © 2026 StudioSpace. All rights reserved.
                </p>
            </div>
        </main>
    );
}
