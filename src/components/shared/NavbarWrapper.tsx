"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { authClient } from "@/lib/auth-client";

interface NavbarUser {
    name: string;
    image?: string;
}

export default function NavbarWrapper() {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();
    const [activeUser, setActiveUser] = useState<NavbarUser | null>(null);

    // Sync from useSession hook
    useEffect(() => {
        if (session?.user) {
            setActiveUser({
                name: session.user.name || "StudioSpace User",
                image: session.user.image || undefined,
            });
        } else if (!isPending) {
            // Check if there is already a token in localStorage
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("better-auth-token")
                    : null;

            if (token) {
                authClient.getSession().then((res) => {
                    if (res?.data?.user) {
                        setActiveUser({
                            name: res.data.user.name || "StudioSpace User",
                            image: res.data.user.image || undefined,
                        });
                    } else {
                        setActiveUser(null);
                    }
                });
            } else {
                setActiveUser(null);
            }
        }
    }, [session, isPending]);

    // Handle token from OAuth redirect and auth state events
    useEffect(() => {
        if (typeof window === "undefined") return;

        const checkAndApplyToken = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");

            if (token) {
                localStorage.setItem("better-auth-token", token);
                urlParams.delete("token");
                const newQuery = urlParams.toString();
                const newUrl =
                    window.location.pathname + (newQuery ? `?${newQuery}` : "");
                window.history.replaceState({}, "", newUrl);

                // Fetch session immediately and update user badge in real-time
                const res = await authClient.getSession();
                if (res?.data?.user) {
                    setActiveUser({
                        name: res.data.user.name || "StudioSpace User",
                        image: res.data.user.image || undefined,
                    });
                }
                router.refresh();
            }
        };

        checkAndApplyToken();

        const handleAuthChange = async () => {
            const res = await authClient.getSession();
            if (res?.data?.user) {
                setActiveUser({
                    name: res.data.user.name || "StudioSpace User",
                    image: res.data.user.image || undefined,
                });
            } else {
                setActiveUser(null);
            }
        };

        window.addEventListener("auth-state-change", handleAuthChange);
        return () => {
            window.removeEventListener("auth-state-change", handleAuthChange);
        };
    }, [router]);

    const handleLogout = async () => {
        try {
            setActiveUser(null);
            if (typeof window !== "undefined") {
                localStorage.removeItem("better-auth-token");
                window.dispatchEvent(new Event("auth-state-change"));
            }
            await authClient.signOut();
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (isPending && !activeUser) {
        return <div className="h-20 w-full" />;
    }

    return (
        <Navbar
            user={activeUser}
            onLogout={handleLogout}
        />
    );
}
