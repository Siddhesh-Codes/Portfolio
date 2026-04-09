"use client";

import { useEffect, useRef } from "react";
import TypescriptIcon from "@/components/icons/typescript-icon";
import BrandReactIcon from "@/components/icons/brand-react-icon";
import BrandNextjsIcon from "@/components/icons/brand-nextjs-icon";
import NodejsIcon from "@/components/icons/nodejs-icon";
import DockerIcon from "@/components/icons/docker-icon";
import GithubIcon from "@/components/icons/github-icon";

interface Skill {
  name: string;
  icon: string; // key for icon lookup
}

interface SkillCategory {
  label: string;
  skills: Skill[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    label: "Languages",
    skills: [
      { name: "JavaScript", icon: "js" },
      { name: "TypeScript", icon: "ts" },
    ],
  },
  {
    label: "Frontend",
    skills: [
      { name: "React", icon: "react" },
      { name: "React Native", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
    ],
  },
  {
    label: "Backend",
    skills: [
      { name: "Node.js", icon: "nodejs" },
      { name: "Bun", icon: "bun" },
      { name: "WebSockets", icon: "ws" },
      { name: "Express", icon: "express" },
    ],
  },
  {
    label: "Styling",
    skills: [
      { name: "Tailwind", icon: "tailwind" },
    ],
  },
  {
    label: "Databases",
    skills: [
      { name: "MongoDB", icon: "mongodb" },
      { name: "Prisma", icon: "prisma" },
      { name: "Supabase", icon: "supabase" },
      { name: "PostgreSQL", icon: "postgres" },
    ],
  },
  {
    label: "DevOps & Tools",
    skills: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Postman", icon: "postman" },
      { name: "Docker", icon: "docker" },
    ],
  },
];

// Set of skill keys that have animated itshover icons
const ANIMATED_ICON_KEYS = new Set(["ts", "react", "nextjs", "nodejs", "docker", "github"]);

// Animated icon components from itshover.com (rendered via forwardRef + motion)
function AnimatedSkillIcon({ iconKey }: { iconKey: string }) {
  const size = 16;
  switch (iconKey) {
    case "ts":
      return <TypescriptIcon size={size} />;
    case "react":
      return <BrandReactIcon size={size} />;
    case "nextjs":
      return <BrandNextjsIcon size={size} />;
    case "nodejs":
      return <NodejsIcon size={size} />;
    case "docker":
      return <DockerIcon size={size} />;
    case "github":
      return <GithubIcon size={size} />;
    default:
      return null;
  }
}

// Inline static SVG icons for skills without animated versions
function StaticSkillIcon({ icon: iconKey }: { icon: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    js: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.405-.6-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
      </svg>
    ),
    cpp: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.11c-3.92 0-7.109-3.19-7.109-7.11 0-3.92 3.19-7.11 7.11-7.11a7.133 7.133 0 0 1 6.156 3.553l-3.076 1.78a3.567 3.567 0 0 0-3.08-1.78A3.56 3.56 0 0 0 8.444 12 3.56 3.56 0 0 0 12 15.555a3.57 3.57 0 0 0 3.08-1.778l3.078 1.78A7.135 7.135 0 0 1 12 19.11zm7.11-6.715h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79zm2.962 0h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79z" />
      </svg>
    ),
    bun: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 22.596c6.628 0 12-4.338 12-7.522 0-1.297-.86-2.509-2.37-3.545.139-.203.222-.439.222-.694 0-.756-.726-1.369-1.622-1.369-.376 0-.722.124-.99.328A15.474 15.474 0 0 0 12 8.922c-2.483 0-4.785.625-6.56 1.676a1.738 1.738 0 0 0-.83-.24c-.896 0-1.622.613-1.622 1.37 0 .357.158.682.42.92C1.328 13.64 0 14.73 0 15.074 0 18.258 5.372 22.596 12 22.596Z" />
      </svg>
    ),
    ws: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M3.727 1.234C2.22 1.234 1 2.454 1 3.961v16.078A2.727 2.727 0 0 0 3.727 22.766h16.546A2.727 2.727 0 0 0 23 20.039V3.961a2.727 2.727 0 0 0-2.727-2.727zm3.737 5.313h1.585l2.44 7.77h.051l2.44-7.77h1.585l-3.36 10.453h-1.38z" />
      </svg>
    ),
    tailwind: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    ),
    mongodb: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0 1 11.91 24h.27c.07 0 .14.004.21.004.1-.404.298-1.202.347-1.725.052-.56-.019-1.064-.019-1.064s1.063-.85 1.668-1.907c1.67-2.905 1.09-6.455.807-8.753z" />
      </svg>
    ),
    mongoose: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0 1 11.91 24h.27c.07 0 .14.004.21.004.1-.404.298-1.202.347-1.725.052-.56-.019-1.064-.019-1.064s1.063-.85 1.668-1.907c1.67-2.905 1.09-6.455.807-8.753z" />
      </svg>
    ),
    prisma: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M21.8068 18.2848L13.5528.7565c-.207-.4382-.639-.7175-1.1286-.7302h-.0381c-.4907.0127-.9229.2921-1.1286.7302L2.1918 18.2848c-.2122.4508-.1385.9838.1916 1.3542.33.3704.8535.5107 1.3307.357l8.286-2.6698c.0977-.0315.2026-.0315.3003 0l8.286 2.6698a1.0523 1.0523 0 0 0 1.3307-.357c.33-.3704.404-.9034.192-1.3542zm-9.3684-1.093a.3.3 0 0 1-.3718-.2058L6.7 5.3645a.3.3 0 0 1 .4258-.381l6.3447 2.568a.3.3 0 0 1 .1803.3892L12.746 16.93a.3.3 0 0 1-.3076.262z" />
      </svg>
    ),
    supabase: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z" />
      </svg>
    ),
    postgres: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M17.128 0a10.134 10.134 0 0 0-2.755.403l-.063.02A10.922 10.922 0 0 0 12.6.258C11.422.238 10.347.524 9.445 1.06 8.85.805 7.702.42 6.467.278 5.015.109 3.83.364 3.097 1.228c-.705.83-.895 2.088-.608 3.681.09.496.217 1.006.373 1.52-.39.544-.7 1.16-.895 1.832-.328 1.14-.378 2.316-.017 3.332.32.9.947 1.613 1.753 2.033.145 1.16.631 2.378 1.378 3.293.787.965 1.816 1.594 3.008 1.77.266.038.528.054.786.054.55 0 1.082-.09 1.579-.26a4.613 4.613 0 0 0 2.053-.84 4.674 4.674 0 0 0 1.569.94c.524.19 1.087.3 1.67.33h.16c.988 0 1.8-.31 2.398-.897a3.654 3.654 0 0 0 .747-1.282 5.16 5.16 0 0 0 .5.003c1.416-.026 2.484-.344 3.205-.938a2.636 2.636 0 0 0 .889-1.548c.09-.456.073-.961-.054-1.498l-1.22-3.459c.267-.576.472-1.173.608-1.79.342-1.55.189-2.88-.493-3.737A2.717 2.717 0 0 0 20.058.168 5.207 5.207 0 0 0 17.128 0z" />
      </svg>
    ),
    git: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.66 2.66c.645-.222 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.72.719-1.886.719-2.605 0-.538-.536-.667-1.34-.388-1.998l-2.48-2.48v6.53c.174.087.328.196.467.335.718.72.718 1.886 0 2.604-.72.72-1.886.72-2.605 0-.719-.718-.719-1.884 0-2.604.177-.178.384-.312.604-.395v-6.59c-.22-.084-.427-.218-.604-.396-.546-.546-.668-1.357-.365-2.011L8.262 5.046l-5.81 5.81c-.604.605-.604 1.583 0 2.19l10.48 10.48c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.186" />
      </svg>
    ),
    postman: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M13.527.099C6.955-.744.942 3.9.099 10.473c-.843 6.572 3.8 12.584 10.373 13.428 6.573.843 12.587-3.801 13.428-10.374C24.744 6.955 20.101.943 13.527.099zm2.471 7.485a.855.855 0 0 1 0 1.21c-.333.333-.869.333-1.202 0a.855.855 0 0 1 0-1.21.855.855 0 0 1 1.202 0z" />
      </svg>
    ),
    redis: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M10.5 2.661l.54.997-1.797.644 2.409.166.592 1.12.57-1.206 2.355-.084-1.792-.543.541-.997-1.473.644zm-3.036 3.659l2.636 1.143L12 8.292l-1.9-.83-.073.047h.001L7.464 8.87l2.636 1.143L12 10.84l-1.9-.827-.073.045h.001l-2.636 1.36 2.636 1.144L12 13.39l-1.9-.828-.073.046h.001L7.464 14.12 24 6.68z" />
      </svg>
    ),
    aws: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.374 6.18 6.18 0 0 1-.248-.467c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103a6.395 6.395 0 0 0-.862.272 2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167 4.516 4.516 0 0 1 1.044-.375 5.02 5.02 0 0 1 1.284-.151c.976 0 1.692.222 2.147.662.45.44.679 1.11.679 2.007v2.64z" />
      </svg>
    ),
    express: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M24 18.588a1.529 1.529 0 0 1-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 0 1-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 0 1 1.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 0 1 1.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 0 0 0 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 0 0 2.582-2.876c.207-.666.548-.78 1.174-.584a5.084 5.084 0 0 1-2.288 3.27c-1.376.9-2.882 1.109-4.469.795a5.62 5.62 0 0 1-4.092-3.423c-.4-.97-.556-2.01-.605-3.073z" />
      </svg>
    ),
  };

  const svgElement = iconMap[iconKey];
  if (!svgElement) {
    return <span className="w-4 h-4 rounded bg-accent/20 block" />;
  }
  return svgElement;
}

// Unified icon dispatcher
function SkillIcon({ icon }: { icon: string }) {
  if (ANIMATED_ICON_KEYS.has(icon)) {
    return <AnimatedSkillIcon iconKey={icon} />;
  }
  return <StaticSkillIcon icon={icon} />;
}

export function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initAnimation = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current) return;

      const pills = containerRef.current.querySelectorAll(".skill-pill");
      gsap.set(pills, { opacity: 0, y: 20, scale: 0.9 });

      gsap.to(pills, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        stagger: 0.04,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });
    };

    initAnimation();
  }, []);

  // Flatten all skills for the pill display
  const allSkills = SKILL_CATEGORIES.flatMap((cat) => cat.skills);

  return (
    <section id="skills" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-sm uppercase tracking-[0.3em] text-accent mb-4 text-center">
          Skills
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-md mx-auto">
          Technologies I work with every day
        </p>

        <div ref={containerRef} className="flex flex-wrap justify-center gap-3">
          {allSkills.map((skill) => (
            <div
              key={skill.name}
              className="skill-pill group inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 cursor-default"
            >
              <span className="text-muted-foreground group-hover:text-accent transition-colors">
                <SkillIcon icon={skill.icon} />
              </span>
              <span className="text-sm text-foreground font-medium">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
