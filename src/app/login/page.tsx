"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
    Aperture,
    Mail,
    Lock,
    ArrowRight,
    Eye,
    EyeOff,
} from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const callbackURL = searchParams.get("callbackURL");

    // Allow only safe internal paths
    const redirectURL =
        callbackURL &&
            callbackURL.startsWith("/") &&
            !callbackURL.startsWith("//") &&
            !callbackURL.includes("\\")
            ? callbackURL
            : "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Email Login
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

            toast.success("Logged in successfully!");
            router.replace(redirectURL);
            router.refresh();
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Google Login
    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: `${window.location.origin}${redirectURL}`,
                errorCallbackURL: `${window.location.origin}/login`,
            });

            if (error) {
                console.error("Google Login Error:", error);
                setError(error.message || "Google login failed.");
                setLoading(false);
            }
        } catch (err) {
            console.error("Google Login Error:", err);
            setError("Google login failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <section className="flex min-h-screen items-center justify-center bg-[#dcebe0] px-5 py-16 text-[#18352a] dark:bg-[#0b0f0d] dark:text-[#f0fdf4]">
            <div className="w-full max-w-md">

                {/* Logo */}
                <Link href="/" className="mb-8 flex items-center justify-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#34d399] to-[#166534] text-white shadow-lg shadow-emerald-900/20">
                        <Aperture size={27} />
                    </span>

                    <span className="text-2xl font-bold">
                        Studio<span className="text-[#166534] dark:text-[#34d399]">Space</span>
                    </span>
                </Link>

                {/* Login Card */}
                <div className="rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-7 shadow-2xl shadow-emerald-950/10 sm:p-9 dark:border-[#263d32] dark:bg-[#14251f]">

                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold">
                            Welcome Back
                        </h1>

                        <p className="mt-2 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                            Sign in to continue to StudioSpace
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-[#18352a] dark:text-[#d1fae5]"
                            >
                                Email Address
                            </label>

                            <div className="flex items-center rounded-lg border border-[#b8d1bf] bg-white px-3 transition focus-within:border-[#166534] dark:border-[#365343] dark:bg-[#0b0f0d] dark:focus-within:border-[#34d399]">
                                <Mail size={18} className="text-[#527463] dark:text-[#a7b9ae]" />

                                <input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-transparent px-3 py-3 text-sm text-[#18352a] outline-none placeholder:text-[#82978a] dark:text-white dark:placeholder:text-[#71877a]"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-[#18352a] dark:text-[#d1fae5]"
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => toast.info("Password reset feature will be available soon.")}
                                    className="text-xs font-semibold text-[#166534] hover:underline dark:text-[#34d399]"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <div className="flex items-center rounded-lg border border-[#b8d1bf] bg-white px-3 transition focus-within:border-[#166534] dark:border-[#365343] dark:bg-[#0b0f0d] dark:focus-within:border-[#34d399]">
                                <Lock size={18} className="shrink-0 text-[#527463] dark:text-[#a7b9ae]" />

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full bg-transparent px-3 py-3 text-sm text-[#18352a] outline-none placeholder:text-[#82978a] dark:text-white dark:placeholder:text-[#71877a]"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showPassword}
                                    className="ml-2 shrink-0 text-[#527463] transition hover:text-[#166534] dark:text-[#a7b9ae] dark:hover:text-[#34d399]"
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#166534] py-3 font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#14532d] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-[#b8d1bf] dark:bg-[#365343]" />

                        <span className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
                            OR CONTINUE WITH
                        </span>

                        <div className="h-px flex-1 bg-[#b8d1bf] dark:bg-[#365343]" />
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
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

                    {/* Register Link */}
                    <p className="mt-7 text-center text-sm text-[#52665b] dark:text-[#a7b9ae]">
                        Don&apos;t have an account?{" "}

                        <Link
                            href="/register"
                            className="font-semibold text-[#166534] transition hover:text-[#14532d] dark:text-[#34d399] dark:hover:text-[#6ee7b7]"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>

                {/* Copyright */}
                <p className="mt-6 text-center text-xs text-[#52665b] dark:text-[#71877a]">
                    © 2026 StudioSpace. All rights reserved.
                </p>
            </div>
        </section>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <section className="flex min-h-screen items-center justify-center bg-[#dcebe0] dark:bg-[#0b0f0d]">
                    <p className="text-[#166534] dark:text-[#34d399]">
                        Loading...
                    </p>
                </section>
            }
        >
            <LoginForm />
        </Suspense>
    );
}
