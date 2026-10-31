
import Link from "next/link";
import {
    Camera,
    Clapperboard,
    Mic2,
    Music2,
    Palette,
    ArrowUpRight,
} from "lucide-react";

const categories = [
    {
        title: "Photo Studios",
        description: "Perfect spaces for photography and creative shoots.",
        icon: Camera,
        number: "01",
    },
    {
        title: "Sound Stages",
        description: "Professional spaces for film and video production.",
        icon: Clapperboard,
        number: "02",
    },
    {
        title: "Podcast Rooms",
        description: "Create podcasts with professional recording setups.",
        icon: Mic2,
        number: "03",
    },
    {
        title: "Music Suites",
        description: "Explore spaces built for music and sound production.",
        icon: Music2,
        number: "04",
    },
    {
        title: "Art Workshops",
        description: "Inspiring spaces for art, design and creativity.",
        icon: Palette,
        number: "05",
    },
];

export default function BrowseCategories() {
    return (
        <section className="border-y border-[#b8d1bf] bg-[#dcebe0] px-6 py-24 text-[#18352a] shadow-sm transition-colors duration-300 dark:border-[#263d32] dark:bg-[#0b0f0d] dark:text-white md:px-12 lg:px-20">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#166534] dark:text-[#34d399]">
                            Explore By Category
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            Find Your Perfect{" "}
                            <span className="text-[#166534] dark:text-[#34d399]">
                                Creative Space
                            </span>
                        </h2>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#40594b] dark:text-[#a7b9ae] sm:text-base">
                            From photography to music production, discover a workspace
                            that brings your creative vision to life.
                        </p>
                    </div>

                    <Link
                        href="/studios"
                        className="group flex w-fit items-center gap-2 text-sm font-semibold text-[#166534] transition hover:text-[#14532d] dark:text-[#34d399] dark:hover:text-[#6ee7b7]"
                    >
                        Explore All Studios
                        <ArrowUpRight
                            size={18}
                            className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => {
                        const Icon = category.icon;

                        return (
                            <Link
                                key={category.title}
                                href={`/studios?category=${encodeURIComponent(category.title)}`}
                                className="group relative overflow-hidden rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#34d399] hover:bg-[#f7fbf8] hover:shadow-md dark:border-[#263d32] dark:bg-[#14251f] dark:hover:border-[#34d399]/50 dark:hover:bg-[#1b3428] dark:hover:shadow-none"
                            >
                                <div className="mb-8 flex items-center justify-between">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#a7c9b1] bg-[#d2e8d8] text-[#166534] transition group-hover:bg-[#166534] group-hover:text-white dark:border-[#34d399]/30 dark:bg-[#34d399]/10 dark:text-[#34d399] dark:group-hover:bg-[#34d399] dark:group-hover:text-[#0b0f0d]">
                                        <Icon size={27} strokeWidth={1.7} />
                                    </div>

                                    <span className="text-sm font-medium text-[#718a79] dark:text-[#62776b]">
                                        {category.number}
                                    </span>
                                </div>

                                <h3 className="mb-3 text-xl font-semibold transition group-hover:text-[#166534] dark:group-hover:text-[#34d399]">
                                    {category.title}
                                </h3>

                                <p className="max-w-xs text-sm leading-6 text-[#40594b] dark:text-[#a7b9ae]">
                                    {category.description}
                                </p>

                                <div className="mt-7 flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-[#166534] dark:text-[#34d399]">
                                        Explore Category
                                    </span>

                                    <ArrowUpRight
                                        size={19}
                                        className="text-[#718a79] transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#166534] dark:text-[#62776b] dark:group-hover:text-[#34d399]"
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
