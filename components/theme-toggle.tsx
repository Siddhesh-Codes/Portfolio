"use client";

import { useTheme } from "next-themes";
import { useRef, useSyncExternalStore } from "react";
import BrightnessDownIcon from "@/components/icons/brightness-down-icon";
import MoonIconAnimated from "@/components/icons/moon-icon";
import type { AnimatedIconHandle } from "@/components/icons/types";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const sunRef = useRef<AnimatedIconHandle>(null);
  const moonRef = useRef<AnimatedIconHandle>(null);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const isDark = theme === "dark";

  const handleMouseEnter = () => {
    if (isDark) {
      moonRef.current?.startAnimation();
    } else {
      sunRef.current?.startAnimation();
    }
  };

  const handleMouseLeave = () => {
    if (isDark) {
      moonRef.current?.stopAnimation();
    } else {
      sunRef.current?.stopAnimation();
    }
  };

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-10 h-10 rounded-full flex items-center justify-center bg-muted hover:bg-border transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {/* Light mode: Sun icon */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
        }`}
      >
        <BrightnessDownIcon ref={sunRef} size={22} />
      </span>
      {/* Dark mode: Moon icon */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
        }`}
      >
        <MoonIconAnimated ref={moonRef} size={18} />
      </span>
    </button>
  );
}
