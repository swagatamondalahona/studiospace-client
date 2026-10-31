
"use client";

import {
    Search,
    Clock,
    CalendarCheck,
    Clapperboard,
    ArrowRight,
} from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Discover Spaces",
        description:
            "Explore professional studios and find the perfect creative space for your project.",
        icon: Search,
    },
    {
        number: "02",
        title: "Select Shoot Hours",
        description:
            "Choose your preferred date, time, and the number of hours you need.",
        icon: Clock,
    },
    {
        number: "03",
        title: "Book Instantly",
        description:
            "Confirm your booking and get ready for a smooth creative experience.",
        icon: CalendarCheck,
    },
    {
        number: "04",
        title: "Create & Produce",
        description:
            "Arrive at your studio and bring your creative ideas to life.",
        icon: Clapperboard,
    },
];

export default function HowBookingWorks() {
    return (
        <section
            id="how-it-works"
            className="bg-[#dcebe0] px-6 py-24 text-[#18352a] transition-colors duration-300 dark:bg-[#0b0f0d] dark:text-white md:px-12 lg:px-20"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#166534] dark:text-[#34d399]">
                        Simple Booking Process
                    </p>

                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        How Booking{" "}
                        <span className="text-[#166534] dark:text-[#34d399]">
                            Works
                        </span>
                    </h2>

                    <p className="mt-5 text-sm leading-7 text-[#40594b] dark:text-[#a7b9ae] sm:text-base">
                        Booking your perfect creative space is simple. Follow these four
                        easy steps and focus on what you do best.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.number}
                                className="group relative rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-7 transition duration-300 hover:-translate-y-2 hover:border-[#34d399] hover:bg-[#f7fbf8] dark:border-[#263d32] dark:bg-[#14251f] dark:hover:border-[#34d399]/50 dark:hover:bg-[#1b3428]"
                            >
                                <div className="mb-8 flex items-center justify-between">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#a7c9b1] bg-[#d2e8d8] text-[#166534] transition group-hover:bg-[#166534] group-hover:text-white dark:border-[#34d399]/30 dark:bg-[#34d399]/10 dark:text-[#34d399] dark:group-hover:bg-[#34d399] dark:group-hover:text-[#0b0f0d]">
                                        <Icon size={27} strokeWidth={1.7} />
                                    </div>

                                    <span className="text-3xl font-bold text-[#a4bca9] dark:text-[#40594b]">
                                        {step.number}
                                    </span>
                                </div>

                                <h3 className="mb-3 text-xl font-semibold transition group-hover:text-[#166534] dark:group-hover:text-[#34d399]">
                                    {step.title}
                                </h3>

                                <p className="text-sm leading-7 text-[#40594b] dark:text-[#a7b9ae]">
                                    {step.description}
                                </p>

                                {index !== steps.length - 1 && (
                                    <ArrowRight
                                        size={20}
                                        className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-[#166534] dark:text-[#34d399] lg:block"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
