import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type CaseStudyFrontmatter = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  stack: string[];
  domain: string[];
  metrics?: { label: string; value: string }[];
  links?: { label: string; href: string }[];
  hero?: { kind?: "stub"; hue?: string };
};

export type CaseStudy = {
  frontmatter: CaseStudyFrontmatter;
  content: string;
};

const WORK_DIR = path.join(process.cwd(), "src", "content", "work");

export function listCaseStudies(): CaseStudyFrontmatter[] {
  if (!fs.existsSync(WORK_DIR)) return [];
  return fs
    .readdirSync(WORK_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(WORK_DIR, f), "utf8");
      const { data } = matter(raw);
      return {
        ...(data as Omit<CaseStudyFrontmatter, "slug">),
        slug: f.replace(/\.mdx$/, ""),
      } as CaseStudyFrontmatter;
    });
}

export function getCaseStudy(slug: string): CaseStudy | null {
  const file = path.join(WORK_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    frontmatter: { ...(data as Omit<CaseStudyFrontmatter, "slug">), slug },
    content,
  };
}
