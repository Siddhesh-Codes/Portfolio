"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

function DesktopNavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="nav-link-classic inline-flex items-center text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:text-foreground"
    >
      <span className="relative z-10">{label}</span>
    </Link>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isBlogPage = pathname.startsWith("/blog");

  const navLinks = [
    isBlogPage
      ? { href: "/", label: "Home" }
      : { href: "/#about", label: "About Me" },
    { href: "/#work", label: "My Work" },
    { href: "/blog", label: "Blogs" },
    { href: "/#contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2">
      <div className="flex h-14 items-center justify-between rounded-2xl border border-border/40 bg-background/70 px-5 shadow-lg shadow-black/5 backdrop-blur-2xl transition-all duration-500">
        <Link href="/" className="flex h-full shrink-0 items-center gap-3">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-accent/30">
            <Image
              src="/images/profile.jpg"
              alt="Siddhesh"
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>
          <span
            className={`font-[family-name:var(--font-playwrite-es-deco)] text-150 whitespace-nowrap text-foreground transition-all duration-500 -translate-y-[2px] overflow-hidden ${
              scrolled ? "max-w-[160px] opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            Siddhesh
          </span>
        </Link>

        <div className="hidden h-full items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <DesktopNavLink key={link.href} href={link.href} label={link.label} />
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/50 transition-colors hover:bg-border"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          mobileOpen ? "mt-2 max-h-64 opacity-100" : "mt-0 max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-2 rounded-2xl border border-border/40 bg-background/70 px-5 py-3 shadow-lg shadow-black/5 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
