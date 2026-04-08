"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const ABOUT_TEXT = `I'm Siddhesh — a passionate developer who thrives at the intersection of problem-solving and product building. With deep roots in competitive programming, I've built a mindset that breaks complex challenges into elegant solutions.

I build SaaS products and full-stack applications with a focus on clean architecture, performance, and user experience. From concept to deployment, I care about every pixel and every millisecond.

When I'm not coding, I'm writing — sharing my daily learnings with the community through blogs on algorithms, system design, and the craft of software engineering. I believe in building in public and growing together.`;

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    let gsapModule: typeof import("gsap") | null = null;
    let scrollTriggerModule: typeof import("gsap/ScrollTrigger") | null = null;

    const initAnimation = async () => {
      gsapModule = await import("gsap");
      scrollTriggerModule = await import("gsap/ScrollTrigger");

      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (wordsRef.current.length === 0) return;

      gsap.set(wordsRef.current, {
        opacity: 0.15,
      });

      gsap.to(wordsRef.current, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.03,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 40%",
          scrub: 1,
        },
      });
    };

    initAnimation();

    return () => {
      if (scrollTriggerModule) {
        scrollTriggerModule.ScrollTrigger.getAll().forEach((t) => t.kill());
      }
    };
  }, []);

  const paragraphs = ABOUT_TEXT.split("\n\n");
  let wordIndex = 0;

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-sm uppercase tracking-[0.3em] text-accent mb-16 text-center"
        >
          About Me
        </motion.h2>
        <div ref={containerRef} className="space-y-8">
          {paragraphs.map((para, pIdx) => (
            <p key={pIdx} className="text-xl sm:text-2xl md:text-3xl leading-relaxed font-light text-foreground">
              {para.split(" ").map((word, wIdx) => {
                const currentIndex = wordIndex++;
                return (
                  <span
                    key={`${pIdx}-${wIdx}`}
                    ref={(el) => {
                      if (el) wordsRef.current[currentIndex] = el;
                    }}
                    className="inline-block mr-[0.3em]"
                  >
                    {word}
                  </span>
                );
              })}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
