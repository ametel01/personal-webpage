export type WritingTopic =
  | "AI agent systems"
  | "Developer infrastructure"
  | "Blockchain systems"
  | "Local-first systems"
  | "Product systems";

export type WritingCitation = {
  label: string;
  href: string;
};

export type WritingParagraph =
  | string
  | {
      text: string;
      citations: readonly WritingCitation[];
    };

export type WritingSection = {
  id: string;
  title: string;
  paragraphs: readonly WritingParagraph[];
  listTitle?: string;
  items?: readonly string[];
};

export type WritingDiagram = {
  title: string;
  description: string;
  steps: readonly {
    label: string;
    detail: string;
  }[];
};

export type WritingCodeExample = {
  label: string;
  language: string;
  code: string;
};

export type WritingDecision = {
  decision: string;
  rationale: string;
  tradeoff: string;
};

export type WritingFailureCase = {
  failure: string;
  signal: string;
  response: string;
};

export type WritingRepositoryLink = {
  label: string;
  href: string;
  description: string;
};

export type WritingArticle = {
  slug: string;
  title: string;
  description: string;
  topic: WritingTopic;
  topicDescription: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  searchQuestions: readonly string[];
  keyPoints: readonly string[];
  sections: readonly WritingSection[];
  diagram: WritingDiagram;
  codeExamples: readonly WritingCodeExample[];
  decisions: readonly WritingDecision[];
  failureCases: readonly WritingFailureCase[];
  repositoryLinks: readonly WritingRepositoryLink[];
  relatedProject: {
    title: string;
    href: string;
    description: string;
  };
};

export type WritingTopicGroup = {
  topic: WritingTopic;
  description: string;
  count: number;
  firstArticleSlug: string;
};
