
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AudioLines, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                setError(error.message || "Invalid email or password.");
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

    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch {
            setError("Google login failed. Please try again.");
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
                        <h1 className="text-3xl font-bold">Welcome Back</h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Sign in to continue to StudioSpace
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
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
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
                                Password
                            </label>
                            <div className="flex items-center rounded-lg border border-white/10 bg-white/5 px-3 focus-within:border-blue-500">
                                <Lock size={18} className="text-slate-500" />
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-xs text-slate-500">OR CONTINUE WITH</span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 py-3 text-sm font-medium transition hover:bg-white/10 disabled:opacity-60"
                    >
                        <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.06 13.22l7.98 6.19C12.93 13.72 18.04 9.5 24 9.5Z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 38.05 46.98 31.9 46.98 24.55Z" />
                            <path fill="#FBBC05" d="M10.04 28.59A14.4 14.4 0 0 1 9.27 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.48-6.19Z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-5.96 0-11.07-4.22-12.96-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="mt-7 text-center text-sm text-slate-400">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-semibold text-blue-400 hover:text-blue-300">
                            Create Account
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
