import { createAuthClient } from "better-auth/react";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://studiospace-server-ten.vercel.app";

export const authClient = createAuthClient({
    baseURL: API_URL,
    fetchOptions: {
        credentials: "include",
    },
});
