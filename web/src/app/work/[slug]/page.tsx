import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";

import { getCaseStudy, listCaseStudies } from "@/lib/work";
import { CaseStudyShell } from "@/components/case-study/CaseStudyShell";
import { mdxComponents } from "@/components/case-study/mdx-components";

export async function generateStaticParams() {
  return listCaseStudies().map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const cs = getCaseStudy(slug);
  if (!cs) return { title: "Not found" };
  return {
    title: cs.frontmatter.title,
    description: cs.frontmatter.tagline,
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <CaseStudyShell fm={cs.frontmatter}>
      <MDXRemote source={cs.content} components={mdxComponents} />
    </CaseStudyShell>
  );
}
