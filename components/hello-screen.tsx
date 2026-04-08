"use client";

import { useState, useEffect, useRef } from "react";

const GREETINGS = [
  "Hello",
  "Nǐ hǎo",
  "Hola",
  "Hallo",
  "Bonjour",
  "Olá",
  "こんにちは",
  "Привет",
  "안녕하세요",
  "Ciao",
  "नमस्ते",
];

const EXIT_ANIMATIONS = [
  "translate-y-[-100%]",
  "translate-y-[100%]",
  "translate-x-[-100%]",
  "translate-x-[100%]",
] as const;

export function HelloScreen() {
  const [greeting, setGreeting] = useState(GREETINGS[0]);
  const [phase, setPhase] = useState<"hello" | "rapid" | "final" | "exit" | "done">("hello");
  const [visible, setVisible] = useState(true);
  const exitStyle = useRef<string>(EXIT_ANIMATIONS[0]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Pick random exit animation on mount (client-only to avoid hydration mismatch)
  useEffect(() => {
    exitStyle.current =
      EXIT_ANIMATIONS[Math.floor(Math.random() * EXIT_ANIMATIONS.length)];
  }, []);

  useEffect(() => {
    document.body.style.removeProperty("overflow");
    document.documentElement.style.removeProperty("overflow");
  }, []);

  useEffect(() => {
    const timers = timersRef.current;

    // Phase 1: Show "Hello" for 1.2s
    const t1 = setTimeout(() => {
      setPhase("rapid");
      let idx = 1;
      // Phase 2: Rapid-fire through languages
      const interval = setInterval(() => {
        setGreeting(GREETINGS[idx]);
        idx++;
        if (idx >= GREETINGS.length) {
          clearInterval(interval);
          // Phase 3: Hold the final greeting for 1.1s before exit
          setPhase("final");
          const tFinal = setTimeout(() => {
            // Phase 4: Exit animation
            setPhase("exit");
            const t3 = setTimeout(() => {
              setPhase("done");
              setVisible(false);
            }, 700);
            timers.push(t3);
          }, 1100);
          timers.push(tFinal);
        }
      }, 120);

      // Store interval for cleanup
      timers.push(interval as unknown as ReturnType<typeof setTimeout>);
    }, 1200);

    timers.push(t1);

    return () => {
      timers.forEach(clearTimeout);
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        phase === "exit" ? exitStyle.current : ""
      }`}
    >
      <span
        className="text-white font-serif italic select-none transition-opacity duration-100 text-5xl sm:text-7xl md:text-8xl"
      >
        {greeting}
      </span>
    </div>
  );
}
