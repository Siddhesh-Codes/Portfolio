"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import GithubIcon from "@/components/icons/github-icon";
import LinkedinIcon from "@/components/icons/linkedin-icon";
import MailFilledIcon from "@/components/icons/mail-filled-icon";
import TwitterXIcon from "@/components/icons/twitter-x-icon";

const EMAIL = "siddhesh.codes21@gmail.com";

const socials = [
  {
    id: "x",
    href: "https://x.com/Siddhesh_2110",
    label: "X",
    Icon: TwitterXIcon,
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/siddhesh-shinde21/",
    label: "LinkedIn",
    Icon: LinkedinIcon,
  },
  {
    id: "mail",
    href: `mailto:${EMAIL}`,
    label: "Mail",
    Icon: MailFilledIcon,
  },
  {
    id: "github",
    href: "https://github.com/Siddhesh-Codes",
    label: "GitHub",
    Icon: GithubIcon,
  },
] as const;

function SocialIcon({
  social,
}: {
  social: (typeof socials)[number];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = EMAIL;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isMail = social.id === "mail";

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 4, x: "-50%" }}
            transition={{ duration: 0.15 }}
            className="absolute -top-12 left-1/2 z-50 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
          >
            {isMail ? (
              <span className="inline-flex items-center gap-2">
                <span className="font-mono text-[11px]">{EMAIL}</span>
                <button
                  onClick={copyEmail}
                  className="inline-flex items-center justify-center transition-colors hover:text-accent"
                  aria-label="Copy email"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 opacity-60 transition-opacity hover:opacity-100" />
                  )}
                </button>
              </span>
            ) : (
              social.label
            )}
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900" />
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={social.href}
        target={social.href.startsWith("mailto") ? undefined : "_blank"}
        rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
        className="group flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-muted/80 text-foreground/70 transition-all duration-300 hover:scale-105 hover:border-[var(--accent-light)] hover:bg-muted hover:text-foreground active:scale-95"
        aria-label={social.label}
      >
        <social.Icon size={28} className="transition-transform duration-300" />
      </a>
    </div>
  );
}

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initAnimation = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      gsap.set(sectionRef.current, { opacity: 0, y: 50 });
      gsap.to(sectionRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    };

    initAnimation();
  }, []);

  return (
    <section id="contact" className="py-32 px-6">
      <div ref={sectionRef} className="mx-auto max-w-4xl space-y-8 text-center">
        <div className="flex justify-center">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Socials
          </span>
        </div>

        <h2 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl">
          Let&apos;s build something{" "}
          <span className="extraordinary-hover">
            extraordinary
            <svg
              aria-hidden="true"
              viewBox="0 0 340 24"
              className="extraordinary-hover__curve"
            >
              <path d="M4 14C12 8 20 8 28 14C36 20 44 20 52 14C60 8 68 8 76 14C84 20 92 20 100 14C108 8 116 8 124 14C132 20 140 20 148 14C156 8 164 8 172 14C180 20 188 20 196 14C204 8 212 8 220 14C228 20 236 20 244 14C252 8 260 8 268 14C276 20 284 20 292 14C300 8 308 8 316 14C324 20 332 20 336 14" />
            </svg>
          </span>
        </h2>

        <p className="font-cursive text-2xl text-muted-foreground/80 sm:text-3xl md:text-4xl">
          DM me on X or Drop a Mail
        </p>

        <div className="flex justify-center gap-5 pt-8">
          {socials.map((social) => (
            <SocialIcon key={social.id} social={social} />
          ))}
        </div>
      </div>
    </section>
  );
}
