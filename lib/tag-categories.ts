// Super tag categories for blog filtering
// Each category maps to a set of child tags

export interface TagCategory {
  name: string;
  slug: string;
  color: string; // accent color for the category pill
  tags: string[]; // child tags that belong to this category
}

export const TAG_CATEGORIES: TagCategory[] = [
  {
    name: "Development",
    slug: "development",
    color: "#3B82F6", // blue
    tags: ["next.js", "react", "typescript", "javascript", "node.js", "frontend", "backend", "fullstack", "web", "api"],
  },
  {
    name: "DSA",
    slug: "dsa",
    color: "#10B981", // emerald
    tags: ["algorithms", "data structures", "competitive programming", "leetcode", "codeforces", "dsa", "problem solving"],
  },
  {
    name: "DevOps",
    slug: "devops",
    color: "#8B5CF6", // violet
    tags: ["docker", "aws", "deployment", "ci/cd", "devops", "cloud", "hosting", "vercel", "linux"],
  },
  {
    name: "AI / ML",
    slug: "ai-ml",
    color: "#F59E0B", // amber
    tags: ["ai", "ml", "machine learning", "artificial intelligence", "gpt", "llm", "deep learning", "neural networks"],
  },
  {
    name: "Career",
    slug: "career",
    color: "#EC4899", // pink
    tags: ["career", "freelancing", "product", "saas", "startup", "interview", "resume", "portfolio", "tips"],
  },
  {
    name: "System Design",
    slug: "system-design",
    color: "#F97316", // orange
    tags: ["system design", "architecture", "scalability", "database", "caching", "microservices", "design patterns"],
  },
  {
    name: "Learning",
    slug: "learning",
    color: "#06B6D4", // cyan
    tags: ["learning", "daily", "tutorial", "guide", "best practices", "productivity", "tools"],
  },
  {
    name: "Open Source",
    slug: "open-source",
    color: "#84CC16", // lime
    tags: ["open source", "github", "git", "contribution", "community", "oss"],
  },
];

/**
 * Find which super category a tag belongs to.
 * Returns the first matching category or null.
 */
export function getCategoryForTag(tag: string): TagCategory | null {
  const normalizedTag = tag.toLowerCase().trim();
  for (const category of TAG_CATEGORIES) {
    if (category.tags.includes(normalizedTag)) {
      return category;
    }
  }
  return null;
}

/**
 * Get all categories that match any of the given tags
 */
export function getCategoriesForTags(tags: string[]): TagCategory[] {
  const categories = new Set<string>();
  const result: TagCategory[] = [];

  for (const tag of tags) {
    const category = getCategoryForTag(tag);
    if (category && !categories.has(category.slug)) {
      categories.add(category.slug);
      result.push(category);
    }
  }

  return result;
}
