
import { Suspense } from "react";
import EditStudioForm from "./EditStudioForm";

export default function EditStudioPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    Loading studio...
                </div>
            }
        >
            <EditStudioForm />
        </Suspense>
    );
}
