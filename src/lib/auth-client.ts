import { createAuthClient } from "better-auth/react";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://studiospace-server-ten.vercel.app";

export const authClient = createAuthClient({
    baseURL: API_URL,
    fetchOptions: {
        credentials: "include",
        onRequest: (context) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("better-auth-token");
                if (token) {
                    context.headers.set("Authorization", `Bearer ${token}`);
                }
            }
            return context;
        },
        onSuccess: (ctx) => {
            if (typeof window !== "undefined") {
                const authToken = ctx.response.headers.get("set-auth-token");
                if (authToken) {
                    localStorage.setItem("better-auth-token", authToken);
                }
            }
        },
    },
});
