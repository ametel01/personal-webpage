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
  source: WritingCitation;
  steps: readonly {
    label: string;
    detail: string;
  }[];
};

export type WritingApplicability = {
  useWhen: readonly string[];
  avoidWhen: readonly string[];
};

export type WritingTestedVersion = {
  name: string;
  version: string;
  href: string;
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

type WritingArtifactBase = {
  id: string;
  title: string;
  description: string;
  source: WritingCitation;
};

export type WritingSchemaArtifact = WritingArtifactBase & {
  kind: "schema";
  filename: string;
  code: string;
  fields: readonly {
    path: string;
    type: string;
    requirement: "required" | "conditional" | "derived";
    purpose: string;
  }[];
};

export type WritingArchitectureArtifact = WritingArtifactBase & {
  kind: "architecture";
  lanes: readonly {
    label: string;
    responsibility: string;
    nodes: readonly string[];
  }[];
  flows: readonly string[];
};

export type WritingStateMachineArtifact = WritingArtifactBase & {
  kind: "state-machine";
  states: readonly {
    name: string;
    mode: "mutable" | "immutable" | "terminal" | "derived";
    description: string;
    transitions: readonly string[];
  }[];
};

export type WritingFailureTaxonomyArtifact = WritingArtifactBase & {
  kind: "failure-taxonomy";
  cases: readonly {
    class: string;
    trigger: string;
    boundary: string;
    disposition: string;
  }[];
};

export type WritingPipelineArtifact = WritingArtifactBase & {
  kind: "pipeline";
  stages: readonly {
    stage: string;
    input: string;
    assertion: string;
    output: string;
    failure: string;
  }[];
};

export type WritingDownloadArtifact = WritingArtifactBase & {
  kind: "download";
  href: string;
  filename: string;
  mediaType: string;
  preview: string;
  checks: readonly string[];
};

export type WritingImplementationArtifact = WritingArtifactBase & {
  kind: "implementation";
  filename: string;
  language: string;
  code: string;
  guarantees: readonly string[];
};

export type WritingComparisonArtifact = WritingArtifactBase & {
  kind: "comparison";
  columns: readonly string[];
  rows: readonly {
    criterion: string;
    values: readonly string[];
  }[];
};

export type WritingArtifact =
  | WritingSchemaArtifact
  | WritingArchitectureArtifact
  | WritingStateMachineArtifact
  | WritingFailureTaxonomyArtifact
  | WritingPipelineArtifact
  | WritingDownloadArtifact
  | WritingImplementationArtifact
  | WritingComparisonArtifact;

export type WritingArticle = {
  slug: string;
  title: string;
  description: string;
  directAnswer: {
    text: string;
    citations: readonly WritingCitation[];
  };
  topic: WritingTopic;
  topicDescription: string;
  publishedAt: string;
  updatedAt: string;
  reviewedAt: string;
  testedWith: readonly WritingTestedVersion[];
  validationScope: string;
  readingMinutes: number;
  searchQuestions: readonly string[];
  keyPoints: readonly string[];
  applicability: WritingApplicability;
  sections: readonly WritingSection[];
  diagram: WritingDiagram;
  artifacts: readonly WritingArtifact[];
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
