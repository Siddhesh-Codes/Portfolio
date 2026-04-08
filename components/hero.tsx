"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const ROLES = [
  "Competitive Programmer",
  "Full-Stack Engineer",
  "Daily Learner",
  "SaaS Builder",
];

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const nameWrapperRef = useRef<HTMLDivElement>(null);
  const greetRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const rolesRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);

  // Rotating roles
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleVisible(false);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        setRoleVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initAnimation = async () => {
      const { gsap } = await import("gsap");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set(
        [greetRef.current, subtitleRef.current, rolesRef.current, ctaRef.current],
        { opacity: 0, y: 30 }
      );

      tl.to(greetRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.3);

      const letters = nameWrapperRef.current?.querySelectorAll(".wave-letter");
      if (letters) {
        gsap.set(letters, { y: 60, opacity: 0 });
        tl.to(
          letters,
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "back.out(1.7)",
          },
          0.5
        );
        tl.to(
          letters,
          {
            y: -12,
            duration: 0.2,
            stagger: 0.04,
            ease: "power2.out",
          },
          1.2
        );
        tl.to(
          letters,
          {
            y: 0,
            duration: 0.35,
            stagger: 0.04,
            ease: "bounce.out",
          },
          1.5
        );
        tl.call(
          () => {
            gsap.set(letters, { clearProps: "transform" });
          },
          [],
          2.2
        );
      }

      tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, 1.3)
        .to(rolesRef.current, { opacity: 1, y: 0, duration: 0.6 }, 1.5)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6 }, 1.7);

      const handleScroll = () => {
        if (!heroRef.current) return;
        const scrollY = window.scrollY;
        const opacity = Math.max(0, 1 - scrollY / 600);
        const translateY = scrollY * 0.3;
        heroRef.current.style.opacity = String(opacity);
        heroRef.current.style.transform = `translateY(${translateY}px)`;
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    };

    initAnimation();
  }, []);

  const nameLetters = "Siddhesh".split("");

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
    >
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-accent/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[150px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[200px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent/20 rounded-full animate-particle"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${6 + i * 1.2}s`,
            }}
          />
        ))}
      </div>

      <div ref={heroRef} className="max-w-3xl mx-auto text-center space-y-6">
        {/* Greeting */}
        <p
          ref={greetRef}
          className="text-accent text-3xl sm:text-4xl tracking-wide font-priestacy"
        >
          Hello, I&apos;m
        </p>

        {/* Name */}
        <div ref={nameWrapperRef} className="space-y-3">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-serif italic tracking-tight leading-none hero-gradient-text inline-block">
            {nameLetters.map((letter, i) => (
              <span key={i} className="wave-letter inline-block">
                {letter}
              </span>
            ))}
          </h1>
          <div className="mx-auto w-48 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed"
        >
          Building{" "}
          <span className="text-accent font-medium">Apps &amp; SaaS</span>{" "}
          Products that Matter.
        </p>

        {/* Rotating Roles */}
        <span ref={rolesRef} className="inline-block h-6">
          <span
            className={`text-sm font-[family-name:var(--font-poppins)] text-muted-foreground/70 tracking-wide transition-all duration-300 ${
              roleVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            {ROLES[roleIndex]}
          </span>
        </span>

        {/* CTA */}
        <div ref={ctaRef} className="pt-4">
          <Link
            href="/#work"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-foreground/20 text-foreground font-medium text-sm hover:bg-foreground hover:text-background transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10">View My Work</span>
            <ChevronDown className="w-4 h-4 relative z-10 group-hover:translate-y-0.5 transition-transform" />
            <span className="absolute inset-0 bg-gradient-to-r from-accent/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5 text-muted-foreground/30" />
      </div>
    </section>
  );
}
