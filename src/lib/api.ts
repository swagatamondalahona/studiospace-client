const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://studiospace-server-ten.vercel.app";

export const getAuthHeaders = (): Record<string, string> => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("better-auth-token");
        if (token) {
            return { Authorization: `Bearer ${token}` };
        }
    }
    return {};
};

export default API_URL;
