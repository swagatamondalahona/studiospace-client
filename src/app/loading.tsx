
export default function Loading() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#dcebe0] px-5 dark:bg-[#0b0f0d]">
            <div className="flex flex-col items-center text-center">
                {/* StudioSpace Logo */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#166534] text-3xl font-bold text-white shadow-lg dark:bg-[#34d399] dark:text-[#0b0f0d]">
                    S
                </div>

                <h2 className="text-2xl font-bold text-[#18352a] dark:text-white">
                    StudioSpace
                </h2>

                <p className="mt-2 text-sm text-[#52665b] dark:text-[#a7b9ae]">
                    Preparing your creative space...
                </p>

                {/* Loading Spinner */}
                <div className="mt-7 h-10 w-10 animate-spin rounded-full border-4 border-[#b8d1bf] border-t-[#166534] dark:border-[#263d32] dark:border-t-[#34d399]" />
            </div>
        </main>
    );
}
