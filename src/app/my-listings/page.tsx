export default function MyListingsPage() {
    return (
        <main className="min-h-screen bg-[#dcebe0] px-5 py-16 text-[#18352a] dark:bg-[#0b0f0d] dark:text-white">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold">
                    My Studio Listings
                </h1>

                <p className="mt-3 text-[#52665b] dark:text-[#a7b9ae]">
                    Manage the creative spaces you have added to StudioSpace.
                </p>

                <div className="mt-8 rounded-xl border border-[#b8d1bf] bg-[#edf5ef] p-8 text-center dark:border-[#263d32] dark:bg-[#14251f]">
                    <h2 className="text-xl font-semibold">
                        No Studio Listings Yet
                    </h2>

                    <p className="mt-2 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                        Your studio listings will appear here.
                    </p>
                </div>
            </div>
        </main>
    );
}