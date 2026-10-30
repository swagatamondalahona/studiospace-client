
"use client";

import dynamic from "next/dynamic";

const HeroSliderContent = dynamic(
    () => import("./HeroSliderContent"),
    {
        ssr: false,
        loading: () => (
            <div className="flex min-h-[620px] items-center justify-center bg-[#080D1A] md:min-h-[700px]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
        ),
    }
);

export default function HeroSlider() {
    return <HeroSliderContent />;
}
