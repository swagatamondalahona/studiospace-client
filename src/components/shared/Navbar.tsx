
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    AudioLines,
    Menu,
    X,
    Home,
    Compass,
    Info,
    BookOpen,
    LayoutDashboard,
    PlusCircle,
    Building2,
    CalendarCheck,
    LogOut,
    ChevronDown,
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
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/studios", icon: Compass },
    { name: "How It Works", href: "/how-it-works", icon: BookOpen },
    { name: "About Us", href: "/about", icon: Info },
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
        href: "/my-bookings",
        icon: CalendarCheck,
    },
];

export default function Navbar({
    user = null,
    onLogout,
}: NavbarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const closeMenus = () => {
        setMobileMenuOpen(false);
        setProfileOpen(false);
    };

    const handleLogout = () => {
        closeMenus();

        if (onLogout) {
            onLogout();
        } else {
            router.push("/login");
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#b8d1bf] bg-[#edf5ef]/95 shadow-sm backdrop-blur-xl dark:border-[#263d32] dark:bg-[#0b0f0d]/95">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Original Logo */}
                <Link
                    href="/"
                    onClick={closeMenus}
                    className="flex items-center gap-2"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#166534] text-white shadow-md dark:bg-[#34d399] dark:text-[#0b0f0d]">
                        <AudioLines size={27} strokeWidth={2.2} />
                    </div>

                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-[#18352a] dark:text-white">
                            Studio<span className="text-[#166534] dark:text-[#34d399]">Space</span>
                        </h1>
                        <p className="text-[10px] font-medium tracking-[2px] text-[#52665b] dark:text-[#a7b9ae]">
                            CREATE YOUR SPACE
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-1 lg:flex">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${active
                                    ? "bg-[#dcebe0] text-[#166534] dark:bg-[#14251f] dark:text-[#34d399]"
                                    : "text-[#40594b] hover:bg-[#dcebe0] hover:text-[#166534] dark:text-[#a7b9ae] dark:hover:bg-[#14251f] dark:hover:text-[#6ee7b7]"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop Auth / Profile */}
                <div className="hidden items-center gap-3 lg:flex">
                    {!user ? (
                        <>
                            <Link
                                href="/login"
                                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#18352a] transition hover:bg-[#dcebe0] dark:text-white dark:hover:bg-[#14251f]"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#14532d] dark:bg-[#34d399] dark:text-[#0b0f0d] dark:hover:bg-[#6ee7b7]"
                            >
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 rounded-xl border border-[#b8d1bf] bg-white px-3 py-2 transition hover:bg-[#f7fbf8] dark:border-[#263d32] dark:bg-[#14251f] dark:hover:bg-[#1b3428]"
                            >
                                {user.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name}
                                        width={36}
                                        height={36}
                                        className="h-9 w-9 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dcebe0] text-[#166534] dark:bg-[#263d32] dark:text-[#34d399]">
                                        <UserRound size={20} />
                                    </div>
                                )}

                                <span className="max-w-28 truncate text-sm font-bold text-[#18352a] dark:text-white">
                                    {user.name}
                                </span>

                                <ChevronDown
                                    size={16}
                                    className={`text-[#52665b] transition-transform dark:text-[#a7b9ae] ${profileOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-[#b8d1bf] bg-[#edf5ef] p-2 shadow-xl dark:border-[#263d32] dark:bg-[#14251f]">
                                    <div className="border-b border-[#b8d1bf] px-3 py-3 dark:border-[#263d32]">
                                        <p className="truncate text-sm font-bold text-[#18352a] dark:text-white">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                            Welcome to StudioSpace
                                        </p>
                                    </div>

                                    <div className="py-2">
                                        {dashboardLinks.map((link) => {
                                            const Icon = link.icon;
                                            const active = isActive(link.href);

                                            return (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={closeMenus}
                                                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active
                                                        ? "bg-[#dcebe0] text-[#166534] dark:bg-[#263d32] dark:text-[#34d399]"
                                                        : "text-[#40594b] hover:bg-[#dcebe0] dark:text-[#a7b9ae] dark:hover:bg-[#263d32]"
                                                        }`}
                                                >
                                                    <Icon size={18} />
                                                    {link.name}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    <div className="border-t border-[#b8d1bf] pt-2 dark:border-[#263d32]">
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                                        >
                                            <LogOut size={18} />
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
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="rounded-xl p-2 text-[#18352a] transition hover:bg-[#dcebe0] dark:text-white dark:hover:bg-[#14251f] lg:hidden"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="border-t border-[#b8d1bf] bg-[#edf5ef] px-4 py-4 dark:border-[#263d32] dark:bg-[#0b0f0d] lg:hidden">
                    <div className="mx-auto max-w-7xl space-y-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={closeMenus}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active
                                        ? "bg-[#dcebe0] text-[#166534] dark:bg-[#14251f] dark:text-[#34d399]"
                                        : "text-[#40594b] hover:bg-[#dcebe0] dark:text-[#a7b9ae] dark:hover:bg-[#14251f]"
                                        }`}
                                >
                                    <Icon size={19} />
                                    {link.name}
                                </Link>
                            );
                        })}

                        <div className="my-3 border-t border-[#b8d1bf] dark:border-[#263d32]" />

                        {!user ? (
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/login"
                                    onClick={closeMenus}
                                    className="rounded-xl border border-[#b8d1bf] px-4 py-3 text-center text-sm font-bold text-[#18352a] dark:border-[#263d32] dark:text-white"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    onClick={closeMenus}
                                    className="rounded-xl bg-[#166534] px-4 py-3 text-center text-sm font-bold text-white dark:bg-[#34d399] dark:text-[#0b0f0d]"
                                >
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 rounded-xl bg-[#dcebe0] p-3 dark:bg-[#14251f]">
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt={user.name}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#166534] dark:bg-[#263d32] dark:text-[#34d399]">
                                            <UserRound size={21} />
                                        </div>
                                    )}

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-[#18352a] dark:text-white">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
                                            My Account
                                        </p>
                                    </div>
                                </div>

                                {dashboardLinks.map((link) => {
                                    const Icon = link.icon;
                                    const active = isActive(link.href);

                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={closeMenus}
                                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active
                                                ? "bg-[#dcebe0] text-[#166534] dark:bg-[#14251f] dark:text-[#34d399]"
                                                : "text-[#40594b] hover:bg-[#dcebe0] dark:text-[#a7b9ae] dark:hover:bg-[#14251f]"
                                                }`}
                                        >
                                            <Icon size={19} />
                                            {link.name}
                                        </Link>
                                    );
                                })}

                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                                >
                                    <LogOut size={19} />
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
