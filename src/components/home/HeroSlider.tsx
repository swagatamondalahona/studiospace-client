
"use client";

import dynamic from "next/dynamic";

const HeroSliderContent = dynamic(
    () => import("./HeroSliderContent"),
    {
        ssr: false,
        loading: () => (
            <div className="flex min-h-[620px] items-center justify-center bg-[#dcebe0] dark:bg-[#0b0f0d] md:min-h-[700px]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#166534] border-t-transparent dark:border-[#34d399] dark:border-t-transparent" />
            </div>
        ),
    }
);

export default function HeroSlider() {
    return <HeroSliderContent />;
}
