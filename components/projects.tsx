"use client";

import GithubIcon from "@/components/icons/github-icon";
import ExternalLinkIcon from "@/components/icons/external-link-icon";
import { motion } from "framer-motion";

interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
}

const projects: Project[] = [
  {
    title: "AI Interview System",
    description:
      "A comprehensive analytics dashboard for SaaS businesses with real-time metrics, user tracking, and revenue insights. Features include AI-powered interview analysis, automated transcription, multi-dimensional scoring (0–100), and anti-cheat detection. Built on a secure multi-tenant architecture with role-based admin dashboards, reducing manual screening time by 70%.",
    tech: ["Next.js", "TypeScript", "CloudFlare R2", "Tailwind CSS", "CloudFlare D1", "Vercel", "Nest.js"],
    github: "https://github.com/Siddhesh-Codes/AI-Interview",
    live: "https://platform-peach-mu.vercel.app/",
  },
  {
    title: "AI Powered Crypto Analytics System",
    description:
      "A complete cryptocurrency analytics ecosystem that combines real-time data processing, AI-powered insights, and machine learning predictions into a seamless user experience. Perfect for traders, investors, and crypto enthusiasts seeking data-driven market intelligence.",
    tech: ["React", "TypeScript", "FastAPI", "Python", "Farmer Motion", "Zustand", "Socket.io", "Axios", "Tailwind CSS","React Router", "Scikit-Learn", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
    github: "https://github.com/Siddhesh-Codes/AI-Powered-Crypto-Analytics-Agent",
  },
  {
    title: "Portfolio Website",
    description:
      "Featuring interactive components, smooth animations, and a responsive design that adapts seamlessly across all devices. Includes a blog section powered by MDX for technical articles and project documentation.",
    tech: ["Next.js", "MDX", "Supabase", "GSAP", "Tailwind CSS", "Framer Motion", "Vercel", "TypeScript"],
    github: "#",
  },
  // {
  //   title: "Contest Tracker",
  //   description:
  //     "Track competitive programming contests across Codeforces, LeetCode, and AtCoder with calendar integration and notifications.",
  //   tech: ["React", "Node.js", "PostgreSQL"],
  //   github: "#",
  //   live: "#",
  // },
];

export function Projects() {
  return (
    <section id="work" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-sm uppercase tracking-[0.3em] text-accent mb-4 text-center">
          My Work
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-md mx-auto">
          A selection of projects I&apos;ve built — from SaaS products to developer tools
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              key={project.title}
              className={`project-card group relative rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 ${
                projects.length % 2 !== 0 && index === projects.length - 1
                  ? "md:col-span-2 md:mx-auto md:w-full md:max-w-[calc((100%-1.5rem)/2)]"
                  : ""
              }`}
            >
              {/* Project Number */}
              <span className="absolute top-6 right-6 text-5xl font-bold text-foreground/10 select-none font-mono">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                {project.title}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6 relative z-10">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border group-hover:border-accent/20 transition-colors duration-300"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {project.github && (
                  <a
                    href={project.github}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="GitHub"
                  >
                    <GithubIcon size={20} />
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Live Demo"
                  >
                    <ExternalLinkIcon size={20} />
                  </a>
                )}
              </div>

              {/* Gradient border glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 via-transparent to-accent/5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
