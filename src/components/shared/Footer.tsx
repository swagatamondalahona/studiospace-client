"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
    Aperture,
    Mail,
    MapPin,
    ArrowUpRight,
    Send,
} from "lucide-react";

const footerLinks = {
    explore: [
        { name: "All Studios", href: "/studios" },
        { name: "Photo Studios", href: "/studios?category=Photo%20Studios" },
        { name: "Sound Stages", href: "/studios?category=Sound%20Stages" },
        { name: "Podcast Rooms", href: "/studios?category=Podcast%20Rooms" },
    ],
    categories: [
        { name: "Music Suites", href: "/studios?category=Music%20Suites" },
        { name: "Art Workshops", href: "/studios?category=Art%20Workshops" },
        { name: "Podcast Rooms", href: "/studios?category=Podcast%20Rooms" },
    ],
    company: [
        { name: "About Us", href: "/#about" },
        { name: "How It Works", href: "/#how-it-works" },
        { name: "Host Your Space", href: "/add-studio" },
        { name: "Contact", href: "/#contact" },
    ],
};

const socialLinks = [
    { name: "Facebook", href: "https://www.facebook.com/" },
    { name: "Instagram", href: "https://www.instagram.com/" },
    { name: "LinkedIn", href: "https://www.linkedin.com/" },
    { name: "X", href: "https://x.com/" },
];

export default function Footer() {
    const [newsletterEmail, setNewsletterEmail] = useState("");

    const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newsletterEmail.trim()) return;

        toast.success("Thank you for subscribing to StudioSpace newsletter!");
        setNewsletterEmail("");
    };

    return (
        <footer id="contact" className="border-t border-[#b8d1bf] bg-[#cbded0] px-6 pt-16 text-[#18352a] transition-colors duration-300 dark:border-[#263d32] dark:bg-[#080d0a] dark:text-white md:px-12 lg:px-20">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-5">

                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex w-fit items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#166534] to-[#34d399]">
                                <Aperture size={25} className="text-white" />
                            </span>

                            <span className="text-2xl font-bold tracking-tight">
                                Studio<span className="text-[#166534] dark:text-[#34d399]">Space</span>
                            </span>
                        </Link>

                        <p className="mt-5 max-w-xs text-sm leading-7 text-[#40594b] dark:text-[#a7b9ae]">
                            Discover inspiring creative spaces, connect with talented hosts,
                            and bring your next big idea to life.
                        </p>

                        {/* Social Links */}
                        <div className="mt-6 flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#a7c9b1] bg-[#edf5ef] text-[#52665b] transition hover:border-[#166534] hover:bg-[#166534] hover:text-white dark:border-[#263d32] dark:bg-[#14251f] dark:text-[#a7b9ae] dark:hover:border-[#34d399]/50 dark:hover:bg-[#34d399]/10 dark:hover:text-[#34d399]"
                                >
                                    <span className="text-sm font-bold">
                                        {social.name === "Facebook"
                                            ? "f"
                                            : social.name === "Instagram"
                                                ? "◎"
                                                : social.name === "LinkedIn"
                                                    ? "in"
                                                    : "𝕏"}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="mb-5 text-base font-semibold">
                            Explore Spaces
                        </h3>

                        <ul className="space-y-4">
                            {footerLinks.explore.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#52665b] transition hover:text-[#166534] dark:text-[#a7b9ae] dark:hover:text-[#34d399]"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="mb-5 text-base font-semibold">
                            Popular Categories
                        </h3>

                        <ul className="space-y-4">
                            {footerLinks.categories.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#52665b] transition hover:text-[#166534] dark:text-[#a7b9ae] dark:hover:text-[#34d399]"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="mb-5 text-base font-semibold">
                            Company
                        </h3>

                        <ul className="space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#52665b] transition hover:text-[#166534] dark:text-[#a7b9ae] dark:hover:text-[#34d399]"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="mb-5 text-base font-semibold">
                            Stay Updated
                        </h3>

                        <p className="mb-5 text-sm leading-7 text-[#40594b] dark:text-[#a7b9ae]">
                            Subscribe to receive creative space updates and inspiration.
                        </p>

                        <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
                            <input
                                type="email"
                                required
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                placeholder="Your email address"
                                aria-label="Your email address"
                                className="min-w-0 flex-1 rounded-lg border border-[#a7c9b1] bg-[#edf5ef] px-3 py-3 text-sm text-[#18352a] outline-none placeholder:text-[#718a79] focus:border-[#166534] dark:border-[#263d32] dark:bg-[#14251f] dark:text-white dark:placeholder:text-[#718a79] dark:focus:border-[#34d399]"
                            />

                            <button
                                type="submit"
                                aria-label="Subscribe to newsletter"
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#166534] text-white transition hover:bg-[#14532d] dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                            >
                                <Send size={17} />
                            </button>
                        </form>

                        <p className="mt-3 text-xs text-[#718a79] dark:text-[#82958a]">
                            Stay connected with StudioSpace.
                        </p>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="flex flex-col gap-4 border-t border-[#b8d1bf] py-7 dark:border-[#263d32] sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 text-sm text-[#52665b] dark:text-[#a7b9ae] sm:flex-row sm:gap-8">
                        <div className="flex items-center gap-2">
                            <MapPin size={17} className="text-[#166534] dark:text-[#34d399]" />
                            <span>Connecting creative spaces worldwide</span>
                        </div>

                        <a
                            href="mailto:contact@studiospace.com"
                            className="flex items-center gap-2 transition hover:text-[#166534] dark:hover:text-[#34d399]"
                        >
                            <Mail size={17} className="text-[#166534] dark:text-[#34d399]" />
                            contact@studiospace.com
                            <ArrowUpRight size={14} />
                        </a>
                    </div>
                </div>

                {/* Copyright & Terms */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-[#b8d1bf] py-7 text-center dark:border-[#263d32] sm:flex-row sm:text-left">
                    <p className="text-xs text-[#718a79] dark:text-[#82958a]">
                        © 2026 StudioSpace. All rights reserved.
                    </p>

                    <div className="flex items-center gap-5 text-xs text-[#718a79] dark:text-[#82958a]">
                        <span className="cursor-default">
                            Terms & Conditions
                        </span>

                        <span className="cursor-default">
                            Privacy Policy
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
