
import {
    ShieldCheck,
    BadgeCheck,
    Wrench,
    Headset,
    ArrowUpRight,
} from "lucide-react";

const benefits = [
    {
        number: "01",
        title: "Liability Protection",
        description:
            "Enjoy peace of mind with protection designed to support hosts and creators during every booking.",
        icon: ShieldCheck,
    },
    {
        number: "02",
        title: "Verified Profiles",
        description:
            "Connect with trusted hosts and creators through verified profiles and a reliable community.",
        icon: BadgeCheck,
    },
    {
        number: "03",
        title: "Equipment Safety",
        description:
            "Keep your creative equipment protected with safety-focused studio guidelines and support.",
        icon: Wrench,
    },
    {
        number: "04",
        title: "24/7 Creator Support",
        description:
            "Get assistance whenever you need help with your studio booking or creative experience.",
        icon: Headset,
    },
];

export default function HostGuarantee() {
    return (
        <section className="bg-[#dcebe0] px-6 py-24 text-[#18352a] transition-colors duration-300 dark:bg-[#0b0f0d] dark:text-white md:px-12 lg:px-20">
            <div className="mx-auto max-w-7xl">
                <div className="grid items-center gap-14 lg:grid-cols-2">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#166534] dark:text-[#34d399]">
                            Trust & Protection
                        </p>

                        <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                            Host Guarantee &
                            <span className="block text-[#166534] dark:text-[#34d399]">
                                Creator Support
                            </span>
                        </h2>

                        <p className="mt-6 max-w-xl text-sm leading-8 text-[#40594b] dark:text-[#a7b9ae] sm:text-base">
                            Your creativity deserves a safe and reliable space. StudioSpace
                            is designed to help hosts and creators connect with confidence,
                            backed by dedicated support and safety-focused features.
                        </p>

                        <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-[#166534] dark:text-[#34d399]">
                            <span>Creating with confidence</span>
                            <ArrowUpRight size={18} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {benefits.map((benefit) => {
                            const Icon = benefit.icon;

                            return (
                                <div
                                    key={benefit.number}
                                    className="group rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#34d399] hover:bg-[#f7fbf8] dark:border-[#263d32] dark:bg-[#14251f] dark:hover:border-[#34d399]/50 dark:hover:bg-[#1b3428]"
                                >
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#a7c9b1] bg-[#d2e8d8] text-[#166534] transition group-hover:bg-[#166534] group-hover:text-white dark:border-[#34d399]/30 dark:bg-[#34d399]/10 dark:text-[#34d399] dark:group-hover:bg-[#34d399] dark:group-hover:text-[#0b0f0d]">
                                            <Icon size={25} strokeWidth={1.7} />
                                        </div>

                                        <span className="text-sm font-semibold text-[#718a79] dark:text-[#62776b]">
                                            {benefit.number}
                                        </span>
                                    </div>

                                    <h3 className="mb-3 text-lg font-semibold transition group-hover:text-[#166534] dark:group-hover:text-[#34d399]">
                                        {benefit.title}
                                    </h3>

                                    <p className="text-sm leading-7 text-[#40594b] dark:text-[#a7b9ae]">
                                        {benefit.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
