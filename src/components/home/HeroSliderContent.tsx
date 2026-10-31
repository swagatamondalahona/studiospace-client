
"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Autoplay,
    EffectFade,
    Pagination,
    Navigation,
} from "swiper/modules";

import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Play,
} from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
    {
        id: 1,
        image: "/images/hero-1.jpg",
        subtitle: "FIND YOUR CREATIVE SPACE",
        title: "Where Your Creative Vision Comes to Life.",
        description:
            "Discover inspiring photography studios and turn your creative ideas into extraordinary experiences.",
    },
    {
        id: 2,
        image: "/images/hero-2.jpg",
        subtitle: "CREATE. RECORD. INSPIRE.",
        title: "The Perfect Space for Every Sound.",
        description:
            "Explore professional music and podcast studios designed to bring your sound to life.",
    },
    {
        id: 3,
        image: "/images/hero-3.jpg",
        subtitle: "YOUR SPACE. YOUR STORY.",
        title: "Make Something Extraordinary.",
        description:
            "Find premium creative spaces for filmmaking, photography and professional production.",
    },
];

export default function HeroSliderContent() {
    return (
        <section className="relative w-full overflow-hidden bg-[#dcebe0] dark:bg-[#0b0f0d]">
            <Swiper
                modules={[Autoplay, EffectFade, Pagination, Navigation]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={1000}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={{
                    prevEl: ".hero-prev",
                    nextEl: ".hero-next",
                }}
                className="hero-swiper"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative flex min-h-[620px] items-center md:min-h-[700px]">

                            {/* Background Image */}
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                priority={index === 0}
                                sizes="100vw"
                                className="object-cover"
                            />

                            {/* Light Mode Overlay - Reduced Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#071A12]/65 via-[#071A12]/30 to-transparent dark:hidden" />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#071A12]/25 via-transparent to-transparent dark:hidden" />

                            {/* Dark Mode Overlay - Reduced Gradient */}
                            <div className="absolute inset-0 hidden bg-gradient-to-r from-[#0b0f0d]/70 via-[#0b0f0d]/35 to-transparent dark:block" />

                            <div className="absolute inset-0 hidden bg-gradient-to-t from-[#0b0f0d]/35 via-transparent to-transparent dark:block" />

                            {/* Hero Content */}
                            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-12">
                                <div className="max-w-3xl">

                                    {/* Subtitle */}
                                    <div className="mb-7 flex items-center gap-3">
                                        <span className="h-[2px] w-10 bg-[#34d399]" />

                                        <p className="text-sm font-bold tracking-[0.25em] text-[#a7f3d0]">
                                            {slide.subtitle}
                                        </p>
                                    </div>

                                    {/* Title */}
                                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                                        {slide.title}
                                    </h1>

                                    {/* Description */}
                                    <p className="mt-7 max-w-xl text-base leading-8 text-slate-100 sm:text-lg">
                                        {slide.description}
                                    </p>

                                    {/* CTA Buttons */}
                                    <div className="mt-10 flex flex-wrap items-center gap-4">
                                        <Link
                                            href="/studios"
                                            className="group flex items-center gap-3 rounded-xl bg-[#166534] px-7 py-4 font-bold text-white shadow-lg shadow-emerald-950/30 transition hover:-translate-y-1 hover:bg-[#15803d] dark:bg-[#34d399] dark:text-[#0b0f0d] dark:shadow-emerald-400/10 dark:hover:bg-[#6ee7b7]"
                                        >
                                            Explore Studios

                                            <ArrowRight
                                                size={19}
                                                className="transition-transform group-hover:translate-x-1"
                                            />
                                        </Link>

                                        <Link
                                            href="/studios"
                                            className="flex items-center gap-3 rounded-xl border border-white/50 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur-md transition hover:border-[#34d399] hover:bg-[#34d399]/20 dark:border-white/30 dark:bg-white/5 dark:text-white dark:hover:border-[#34d399] dark:hover:bg-[#34d399]/10"
                                        >
                                            <Play size={17} fill="currentColor" />
                                            Host Your Space
                                        </Link>
                                    </div>

                                    {/* Bottom Text */}
                                    <div className="mt-14 flex items-center gap-4 text-sm text-slate-200">
                                        <span className="h-px w-12 bg-[#34d399]/80" />
                                        <span>DISCOVER · CREATE · INSPIRE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation Buttons */}
            <div className="absolute bottom-10 right-6 z-20 flex gap-3 sm:right-12 lg:right-20">
                <button
                    type="button"
                    aria-label="Previous slide"
                    className="hero-prev flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-[#071A12]/40 text-white backdrop-blur-md transition hover:border-[#34d399] hover:bg-[#166534] dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-[#34d399] dark:hover:bg-[#166534]"
                >
                    <ChevronLeft size={22} />
                </button>

                <button
                    type="button"
                    aria-label="Next slide"
                    className="hero-next flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-[#071A12]/40 text-white backdrop-blur-md transition hover:border-[#34d399] hover:bg-[#166534] dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-[#34d399] dark:hover:bg-[#166534]"
                >
                    <ChevronRight size={22} />
                </button>
            </div>
        </section>
    );
}
