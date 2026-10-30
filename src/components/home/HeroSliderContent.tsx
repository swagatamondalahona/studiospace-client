
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
        <section className="relative w-full overflow-hidden bg-[#080D1A]">

            <Swiper
                modules={[Autoplay, EffectFade, Pagination, Navigation]}
                effect="fade"
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

                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#080D1A] via-[#080D1A]/85 to-[#080D1A]/30" />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#080D1A]/70 via-transparent to-[#080D1A]/20" />

                            {/* Hero Content */}
                            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-12">
                                <div className="max-w-3xl">

                                    <div className="mb-7 flex items-center gap-3">
                                        <span className="h-[2px] w-10 bg-blue-500" />

                                        <p className="text-sm font-bold tracking-[0.25em] text-blue-400">
                                            {slide.subtitle}
                                        </p>
                                    </div>

                                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                                        {slide.title}
                                    </h1>

                                    <p className="mt-7 max-w-xl text-base leading-8 text-gray-300 sm:text-lg">
                                        {slide.description}
                                    </p>

                                    {/* CTA Buttons */}
                                    <div className="mt-10 flex flex-wrap items-center gap-4">

                                        <Link
                                            href="/studios"
                                            className="group flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-1 hover:bg-blue-500"
                                        >
                                            Explore Studios

                                            <ArrowRight
                                                size={19}
                                                className="transition-transform group-hover:translate-x-1"
                                            />
                                        </Link>

                                        <Link
                                            href="/studios"
                                            className="flex items-center gap-3 rounded-xl border border-white/30 bg-white/5 px-7 py-4 font-bold text-white backdrop-blur-md transition hover:border-blue-400 hover:bg-blue-500/10"
                                        >
                                            <Play size={17} fill="currentColor" />
                                            Host Your Space
                                        </Link>

                                    </div>

                                    <div className="mt-14 flex items-center gap-4 text-sm text-gray-400">
                                        <span className="h-px w-12 bg-blue-500/70" />
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
                    className="hero-prev flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:border-blue-400 hover:bg-blue-600"
                >
                    <ChevronLeft size={22} />
                </button>

                <button
                    type="button"
                    aria-label="Next slide"
                    className="hero-next flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:border-blue-400 hover:bg-blue-600"
                >
                    <ChevronRight size={22} />
                </button>

            </div>
        </section>
    );
}
