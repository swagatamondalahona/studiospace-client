
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
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
    Sun,
    Moon,
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
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Add New Studio", href: "/dashboard/studios/new", icon: PlusCircle },
    { name: "My Studio Listings", href: "/dashboard/studios", icon: Building2 },
    { name: "My Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
];

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                type="button"
                aria-label="Change theme"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d1e5d8] bg-white text-[#166534] shadow-sm dark:border-[#263d32] dark:bg-[#14251f] dark:text-[#a7b9ae]"
            >
                <Sun size={19} />
            </button>
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d1e5d8] bg-white text-[#166534] shadow-sm transition duration-200 hover:border-[#34d399] hover:bg-[#ecfdf5] hover:text-[#14532d] dark:border-[#263d32] dark:bg-[#14251f] dark:text-[#34d399] dark:hover:border-[#34d399] dark:hover:bg-[#1b3428] dark:hover:text-[#6ee7b7]"
        >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
    );
}

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
        <header className="sticky top-0 z-50 w-full border-b border-[#d1e5d8] bg-[#f7fdf8]/95 shadow-sm backdrop-blur-xl transition-colors duration-300 dark:border-[#263d32] dark:bg-[#0b0f0d]/95">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo */}
                <Link
                    href="/"
                    onClick={closeMenus}
                    className="flex shrink-0 items-center gap-2.5"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#166534] to-[#34d399] shadow-md shadow-emerald-900/20 dark:shadow-emerald-400/10">
                        <AudioLines
                            size={27}
                            strokeWidth={2.5}
                            className="text-white"
                        />
                    </div>

                    <span className="text-xl font-extrabold tracking-tight text-[#14251f] dark:text-white sm:text-2xl">
                        Studio<span className="text-[#166534] dark:text-[#34d399]">Space</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-7 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative py-2 text-sm font-semibold transition-colors duration-200 ${isActive(link.href)
                                    ? "text-[#166534] dark:text-[#34d399]"
                                    : "text-[#52665b] hover:text-[#166534] dark:text-[#a7b9ae] dark:hover:text-[#34d399]"
                                }`}
                        >
                            {link.name}

                            {isActive(link.href) && (
                                <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-[#166534] dark:bg-[#34d399]" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Desktop Authentication + Theme */}
                <div className="hidden items-center gap-3 lg:flex">
                    <ThemeToggle />

                    {!user ? (
                        <>
                            <Link
                                href="/login"
                                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#52665b] transition hover:text-[#166534] dark:text-[#d1e5d8] dark:hover:text-[#34d399]"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-lg bg-[#166534] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-900/20 transition hover:bg-[#14532d] hover:shadow-lg dark:bg-[#34d399] dark:text-[#0b0f0d] dark:shadow-emerald-400/10 dark:hover:bg-[#6ee7b7]"
                            >
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                className="flex items-center gap-2 rounded-xl border border-[#d1e5d8] bg-white p-2 shadow-sm transition hover:border-[#34d399] dark:border-[#263d32] dark:bg-[#14251f]"
                            >
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="h-9 w-9 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#166534] text-white dark:bg-[#34d399] dark:text-[#0b0f0d]">
                                        <UserRound size={19} />
                                    </div>
                                )}

                                <span className="max-w-28 truncate text-sm font-semibold text-[#14251f] dark:text-white">
                                    {user.name}
                                </span>

                                <ChevronDown
                                    size={16}
                                    className={`text-[#52665b] transition dark:text-[#a7b9ae] ${profileMenuOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {profileMenuOpen && (
                                <div className="absolute right-0 top-14 w-60 overflow-hidden rounded-xl border border-[#d1e5d8] bg-white p-2 shadow-xl dark:border-[#263d32] dark:bg-[#14251f]">
                                    <div className="border-b border-[#e2eee6] px-3 py-3 dark:border-[#263d32]">
                                        <p className="truncate text-sm font-bold text-[#14251f] dark:text-white">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
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
                                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#52665b] transition hover:bg-[#ecfdf5] hover:text-[#166534] dark:text-[#d1e5d8] dark:hover:bg-[#1b3428] dark:hover:text-[#34d399]"
                                                >
                                                    <Icon size={17} />
                                                    {item.name}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    <div className="border-t border-[#e2eee6] pt-2 dark:border-[#263d32]">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileMenuOpen(false);
                                                onLogout?.();
                                            }}
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
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

                {/* Mobile Controls */}
                <div className="flex items-center gap-2 lg:hidden">
                    <ThemeToggle />

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d1e5d8] bg-white text-[#166534] shadow-sm transition hover:border-[#34d399] hover:bg-[#ecfdf5] dark:border-[#263d32] dark:bg-[#14251f] dark:text-white dark:hover:border-[#34d399]"
                        aria-label="Toggle navigation menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="border-t border-[#d1e5d8] bg-[#f0fdf4] px-4 pb-6 pt-4 dark:border-[#263d32] dark:bg-[#0b0f0d] lg:hidden">
                    <div className="mx-auto flex max-w-7xl flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenus}
                                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive(link.href)
                                        ? "bg-white text-[#166534] shadow-sm dark:bg-[#14251f] dark:text-[#34d399]"
                                        : "text-[#52665b] hover:bg-white hover:text-[#166534] dark:text-[#d1e5d8] dark:hover:bg-[#14251f] dark:hover:text-[#34d399]"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="my-3 border-t border-[#d1e5d8] dark:border-[#263d32]" />

                        {!user ? (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/login"
                                    onClick={closeMenus}
                                    className="rounded-lg border border-[#d1e5d8] bg-white px-4 py-3 text-center text-sm font-semibold text-[#14251f] shadow-sm dark:border-[#263d32] dark:bg-[#14251f] dark:text-white"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    onClick={closeMenus}
                                    className="rounded-lg bg-[#166534] px-4 py-3 text-center text-sm font-bold text-white shadow-md dark:bg-[#34d399] dark:text-[#0b0f0d]"
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
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#166534] text-white dark:bg-[#34d399] dark:text-[#0b0f0d]">
                                            <UserRound size={20} />
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm font-bold text-[#14251f] dark:text-white">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-[#52665b] dark:text-[#a7b9ae]">
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
                                            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#52665b] transition hover:bg-white hover:text-[#166534] dark:text-[#d1e5d8] dark:hover:bg-[#14251f] dark:hover:text-[#34d399]"
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
                                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
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
