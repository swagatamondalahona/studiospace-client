import { Suspense } from "react";
import StudioDetails from "./StudioDetails";

export default function StudioDetailsPage() {
    return (
        <Suspense
            fallback={
                <div className="p-10 text-center">Loading studio...</div>
            }
        >
            <StudioDetails />
        </Suspense>
    );
}