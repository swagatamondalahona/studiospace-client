"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { authClient } from "@/lib/auth-client";

export default function NavbarWrapper() {
    const router = useRouter();

    // Check for token passed from OAuth redirect
    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");

            if (token) {
                localStorage.setItem("better-auth-token", token);
                urlParams.delete("token");
                const newQuery = urlParams.toString();
                const newUrl =
                    window.location.pathname + (newQuery ? `?${newQuery}` : "");
                window.history.replaceState({}, "", newUrl);

                // Re-fetch session with the newly set token
                authClient.getSession().then(() => {
                    router.refresh();
                });
            }
        }
    }, [router]);

    const { data: session, isPending } = authClient.useSession();

    const handleLogout = async () => {
        try {
            if (typeof window !== "undefined") {
                localStorage.removeItem("better-auth-token");
            }
            await authClient.signOut();
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (isPending) {
        return <div className="h-20 w-full" />;
    }

    const user = session?.user
        ? {
            name: session.user.name || "StudioSpace User",
            image: session.user.image || undefined,
        }
        : null;

    return (
        <Navbar
            user={user}
            onLogout={handleLogout}
        />
    );
}
