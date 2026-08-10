import { getProject, type Project } from "@/content/projects";
import { type WritingArticle, type WritingSlug, writingArticles } from "@/content/writing";

const relatedProjectSlugsByArticle = {
  "designing-audit-trails-for-ai-agent-workflows": ["agentreceipt", "skills-doctor", "ritualai"],
  "how-to-test-cross-chain-bridge-workflows-locally": ["aggsandbox", "horizon-starknet"],
  "designing-contract-verification-pipelines": ["voyager-verifier", "skills-doctor", "aggsandbox"],
  "modeling-proposal-revisions-and-change-orders": ["scopepilot", "agentreceipt"]
} as const satisfies Record<WritingSlug, readonly Project["slug"][]>;

const adjacentProjectSlugs = {
  agentreceipt: ["skills-doctor", "ritualai"],
  "skills-doctor": ["agentreceipt", "ritualai"],
  ritualai: ["agentreceipt", "skills-doctor"],
  scopepilot: ["agentreceipt", "ritualai"],
  aggsandbox: ["voyager-verifier", "horizon-starknet"],
  "voyager-verifier": ["aggsandbox", "horizon-starknet"],
  "horizon-starknet": ["aggsandbox", "voyager-verifier"]
} as const satisfies Record<Project["slug"], readonly Project["slug"][]>;

export function getRelatedProjectsForArticle(article: WritingArticle) {
  const slugs = relatedProjectSlugsByArticle[article.slug as WritingSlug];

  return slugs.map((slug) => getProject(slug)).filter((project) => project !== undefined);
}

export function getRelatedArticlesForProject(projectSlug: Project["slug"]) {
  return writingArticles.filter((article) => {
    const relatedProjectSlugs: readonly Project["slug"][] =
      relatedProjectSlugsByArticle[article.slug];

    return relatedProjectSlugs.some((relatedProjectSlug) => relatedProjectSlug === projectSlug);
  });
}

export function getAdjacentProjects(projectSlug: Project["slug"]) {
  return adjacentProjectSlugs[projectSlug]
    .map((slug) => getProject(slug))
    .filter((project) => project !== undefined);
}

export function getPrimaryProjectForArticle(articleSlug: WritingSlug) {
  return getProject(relatedProjectSlugsByArticle[articleSlug][0]);
}
