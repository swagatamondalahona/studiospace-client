
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    AudioLines,
    Menu,
    X,
    ChevronDown,
    LayoutDashboard,
    PlusCircle,
    Building2,
    CalendarCheck,
    LogOut,
    UserRound,
} from "lucide-react";

interface NavbarUser {
    name: string;
    image?: string;
}

interface NavbarProps {
    user?: NavbarUser | null;
    onLogout?: () => void;
}

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About Us", href: "/about" },
];

const dashboardLinks = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Add New Studio",
        href: "/dashboard/studios/new",
        icon: PlusCircle,
    },
    {
        name: "My Studio Listings",
        href: "/dashboard/studios",
        icon: Building2,
    },
    {
        name: "My Bookings",
        href: "/dashboard/bookings",
        icon: CalendarCheck,
    },
];

export default function Navbar({
    user = null,
    onLogout,
}: NavbarProps) {
    const pathname = usePathname();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        if (href.includes("#")) return false;

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const closeMenus = () => {
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-blue-500/20 bg-[#080D1A]/95 shadow-lg shadow-black/10 backdrop-blur-xl">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo */}
                <Link
                    href="/"
                    onClick={closeMenus}
                    className="flex shrink-0 items-center gap-2.5"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-sky-400 shadow-lg shadow-blue-500/30">
                        <AudioLines
                            size={27}
                            strokeWidth={2.5}
                            className="text-white"
                        />
                    </div>

                    <span className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                        Studio<span className="text-blue-400">Space</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-7 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative py-2 text-sm font-medium transition-colors duration-200 ${isActive(link.href)
                                    ? "text-blue-400"
                                    : "text-slate-300 hover:text-white"
                                }`}
                        >
                            {link.name}

                            {isActive(link.href) && (
                                <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-blue-400" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Desktop Authentication */}
                <div className="hidden items-center gap-3 lg:flex">
                    {!user ? (
                        <>
                            <Link
                                href="/login"
                                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:text-blue-400"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:scale-105 hover:shadow-blue-500/30"
                            >
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 p-2 transition hover:border-blue-500/50"
                            >
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="h-9 w-9 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                                        <UserRound size={19} />
                                    </div>
                                )}

                                <span className="max-w-28 truncate text-sm font-semibold text-white">
                                    {user.name}
                                </span>

                                <ChevronDown
                                    size={16}
                                    className={`text-slate-400 transition ${profileMenuOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {profileMenuOpen && (
                                <div className="absolute right-0 top-14 w-60 overflow-hidden rounded-xl border border-slate-700 bg-[#101A2D] p-2 shadow-2xl">
                                    <div className="border-b border-slate-700 px-3 py-3">
                                        <p className="truncate text-sm font-bold text-white">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Welcome to StudioSpace
                                        </p>
                                    </div>

                                    <div className="py-2">
                                        {dashboardLinks.map((item) => {
                                            const Icon = item.icon;

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={closeMenus}
                                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-blue-500/10 hover:text-blue-400"
                                                >
                                                    <Icon size={17} />
                                                    {item.name}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    <div className="border-t border-slate-700 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileMenuOpen(false);
                                                onLogout?.();
                                            }}
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
                                        >
                                            <LogOut size={17} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-white transition hover:border-blue-500 hover:text-blue-400 lg:hidden"
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
                </button>
            </nav>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="border-t border-blue-500/20 bg-[#0B1220] px-4 pb-6 pt-4 lg:hidden">
                    <div className="mx-auto flex max-w-7xl flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenus}
                                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive(link.href)
                                        ? "bg-blue-500/10 text-blue-400"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="my-3 border-t border-slate-700" />

                        {!user ? (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/login"
                                    onClick={closeMenus}
                                    className="rounded-lg border border-slate-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-blue-500"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    onClick={closeMenus}
                                    className="rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-3 text-center text-sm font-bold text-white"
                                >
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 px-3 py-3">
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                                            <UserRound size={20} />
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm font-bold text-white">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            My Account
                                        </p>
                                    </div>
                                </div>

                                {dashboardLinks.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeMenus}
                                            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-blue-500/10 hover:text-blue-400"
                                        >
                                            <Icon size={18} />
                                            {item.name}
                                        </Link>
                                    );
                                })}

                                <button
                                    type="button"
                                    onClick={() => {
                                        closeMenus();
                                        onLogout?.();
                                    }}
                                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
