
import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <main
            className="flex min-h-screen items-center justify-center px-6 py-16"
            style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
            }}
        >
            <div className="w-full max-w-xl text-center">

                {/* 404 Illustration */}
                <div
                    className="mx-auto mb-8 flex h-40 w-40 items-center justify-center rounded-full border"
                    style={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                    }}
                >
                    <span
                        className="text-6xl font-extrabold"
                        style={{ color: "var(--primary)" }}
                    >
                        404
                    </span>
                </div>

                {/* Error Message */}
                <p
                    className="mb-3 text-sm font-semibold uppercase tracking-[0.3em]"
                    style={{ color: "var(--primary)" }}
                >
                    Page Not Found
                </p>

                <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
                    Oops! This Space Is Empty.
                </h1>

                <p
                    className="mx-auto mb-8 max-w-md text-base leading-7"
                    style={{ color: "var(--muted)" }}
                >
                    The page you are looking for doesn't exist
                    or may have been moved. Let's get you back
                    to creating something amazing.
                </p>

                {/* Back to Home Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg"
                    style={{
                        backgroundColor: "var(--primary)",
                    }}
                >
                    <Home size={18} />
                    Back to Home
                </Link>

                {/* Footer Text */}
                <p
                    className="mt-12 text-sm"
                    style={{ color: "var(--muted)" }}
                >
                    StudioSpace · Create. Share. Collaborate.
                </p>
            </div>
        </main>
    );
}
