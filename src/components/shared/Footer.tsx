
import Link from "next/link";
import {
    AudioLines,
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
        { name: "About Us", href: "/about" },
        { name: "How It Works", href: "/#how-it-works" },
        { name: "Host Your Space", href: "/dashboard/studios/new" },
        { name: "Contact", href: "/contact" },
    ],
};

const socialLinks = [
    { name: "Facebook", href: "https://www.facebook.com/" },
    { name: "Instagram", href: "https://www.instagram.com/" },
    { name: "LinkedIn", href: "https://www.linkedin.com/" },
    { name: "X", href: "https://x.com/" },
];

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#030712] px-6 pt-16 text-white md:px-12 lg:px-20">
            <div className="mx-auto max-w-7xl">

                <div className="grid gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-5">

                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex w-fit items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-700">
                                <AudioLines size={25} className="text-white" />
                            </span>

                            <span className="text-2xl font-bold tracking-tight">
                                Studio<span className="text-blue-400">Space</span>
                            </span>
                        </Link>

                        <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
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
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-400"
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
                                        className="text-sm text-slate-400 transition hover:text-blue-400"
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
                                        className="text-sm text-slate-400 transition hover:text-blue-400"
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
                                        className="text-sm text-slate-400 transition hover:text-blue-400"
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

                        <p className="mb-5 text-sm leading-7 text-slate-400">
                            Subscribe to receive creative space updates and inspiration.
                        </p>

                        <form className="flex items-center gap-2">
                            <input
                                type="email"
                                required
                                placeholder="Your email address"
                                aria-label="Your email address"
                                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
                            />

                            <button
                                type="submit"
                                aria-label="Subscribe to newsletter"
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-500"
                            >
                                <Send size={17} />
                            </button>
                        </form>

                        <p className="mt-3 text-xs text-slate-500">
                            Stay connected with StudioSpace.
                        </p>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="flex flex-col gap-4 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:gap-8">
                        <div className="flex items-center gap-2">
                            <MapPin size={17} className="text-blue-400" />
                            <span>Connecting creative spaces worldwide</span>
                        </div>

                        <Link
                            href="/contact"
                            className="flex items-center gap-2 transition hover:text-blue-400"
                        >
                            <Mail size={17} className="text-blue-400" />
                            Contact Us
                            <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Copyright & Terms */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-center sm:flex-row sm:text-left">
                    <p className="text-xs text-slate-500">
                        © 2026 StudioSpace. All rights reserved.
                    </p>

                    <div className="flex items-center gap-5 text-xs text-slate-500">
                        <Link href="/terms" className="transition hover:text-blue-400">
                            Terms & Conditions
                        </Link>

                        <Link href="/privacy" className="transition hover:text-blue-400">
                            Privacy Policy
                        </Link>
                    </div>

                    <p className="text-xs text-slate-500">
                        Built for creators. Designed for creativity.
                    </p>
                </div>
            </div>
        </footer>
    );
}
