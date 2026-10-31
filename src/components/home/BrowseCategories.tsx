
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
        <section className="bg-[#050914] px-6 py-24 text-white md:px-12 lg:px-20">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
                            Explore By Category
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            Find Your Perfect{" "}
                            <span className="text-blue-400">Creative Space</span>
                        </h2>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                            From photography to music production, discover a workspace
                            that brings your creative vision to life.
                        </p>
                    </div>

                    <Link
                        href="/studios"
                        className="group flex w-fit items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                    >
                        Explore All Studios
                        <ArrowUpRight
                            size={18}
                            className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => {
                        const Icon = category.icon;

                        return (
                            <Link
                                key={category.title}
                                href={`/studios?category=${encodeURIComponent(category.title)}`}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220] p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-[#101C31]"
                            >
                                <div className="mb-8 flex items-center justify-between">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400 transition group-hover:bg-blue-500 group-hover:text-white">
                                        <Icon size={27} strokeWidth={1.7} />
                                    </div>

                                    <span className="text-sm font-medium text-slate-600">
                                        {category.number}
                                    </span>
                                </div>

                                <h3 className="mb-3 text-xl font-semibold transition group-hover:text-blue-400">
                                    {category.title}
                                </h3>

                                <p className="max-w-xs text-sm leading-6 text-slate-400">
                                    {category.description}
                                </p>

                                <div className="mt-7 flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                                        Explore Category
                                    </span>

                                    <ArrowUpRight
                                        size={19}
                                        className="text-slate-500 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-400"
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
