
"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { authClient } from "@/lib/auth-client";

export default function NavbarWrapper() {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const handleLogout = async () => {
        try {
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
