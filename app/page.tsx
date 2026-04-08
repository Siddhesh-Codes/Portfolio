import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Contact } from "@/components/contact";
import JsonLd from "@/components/json-ld";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Siddhesh",
  url: "https://siddhesh.dev",
  jobTitle: "Full-Stack Developer",
  sameAs: [
    "https://github.com/Siddhesh-Codes",
    "https://x.com/Siddhesh_2110",
    "https://www.linkedin.com/in/siddhesh-shinde21/",
    "https://leetcode.com/u/Siddhesh-21/",
  ],
  knowsAbout: [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
    "Competitive Programming", "System Design", "SaaS Development",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Siddhesh — Developer, Builder, Learner",
  url: "https://siddhesh.dev",
  description: "Personal portfolio and blog by Siddhesh. Building apps and SaaS products that matter.",
  author: { "@type": "Person", name: "Siddhesh" },
};

export default function Home() {
  return (
    <main>
      <JsonLd data={personSchema} />
      <JsonLd data={websiteSchema} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
}
