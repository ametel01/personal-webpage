import { auditingAgentSkills } from "@/content/articles/auditing-agent-skills";
import { localCrossChainTesting } from "@/content/articles/local-cross-chain-testing";
import { localFirstDeveloperTools } from "@/content/articles/local-first-developer-tools";
import { proposalRevisions } from "@/content/articles/proposal-revisions";
import { recordAndVerifyAgentActivity } from "@/content/articles/record-and-verify-agent-activity";
import { replayableAgentEvidence } from "@/content/articles/replayable-agent-evidence";
import { starknetContractVerification } from "@/content/articles/starknet-contract-verification";
import type { WritingArticle, WritingTopicGroup } from "@/content/writing-shared";

export type {
  WritingArticle,
  WritingCitation,
  WritingCodeExample,
  WritingDecision,
  WritingDiagram,
  WritingFailureCase,
  WritingParagraph,
  WritingRepositoryLink,
  WritingSection,
  WritingTopic,
  WritingTopicGroup
} from "@/content/writing-shared";

export const writingArticles = [
  recordAndVerifyAgentActivity,
  replayableAgentEvidence,
  starknetContractVerification,
  auditingAgentSkills,
  localFirstDeveloperTools,
  localCrossChainTesting,
  proposalRevisions
] as const satisfies readonly WritingArticle[];

export type WritingSlug = (typeof writingArticles)[number]["slug"];

export const writingSlugs = writingArticles.map(
  (article) => article.slug
) as readonly WritingSlug[];

export function isWritingSlug(value: string): value is WritingSlug {
  return writingSlugs.some((slug) => slug === value);
}

export function getWritingArticle(slug: string) {
  return writingArticles.find((article) => article.slug === slug);
}

export function getRelatedWriting(article: WritingArticle) {
  return writingArticles.filter((candidate) => candidate.slug !== article.slug).slice(0, 3);
}

export function getWritingTopicGroups(): readonly WritingTopicGroup[] {
  const groups = new Map<string, WritingTopicGroup>();

  for (const article of writingArticles) {
    const existing = groups.get(article.topic);

    groups.set(article.topic, {
      topic: article.topic,
      description: article.topicDescription,
      count: (existing?.count ?? 0) + 1,
      firstArticleSlug: existing?.firstArticleSlug ?? article.slug
    });
  }

  return [...groups.values()];
}
