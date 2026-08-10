import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { resume } from "@/content/resume";
import { writingArticles } from "@/content/writing";
import { getAbsoluteUrl } from "@/lib/metadata";
import { defaultDescription, site } from "@/lib/site";

type CrawlPage = {
  path: string;
  lastModified: string;
};

function latestDate(dates: readonly string[]) {
  return dates.reduce((latest, date) => (date > latest ? date : latest));
}

const projectDates = projects.map((project) => project.caseStudy.lastUpdated);
const writingDates = writingArticles.map((article) => article.updatedAt);

const indexPages: readonly CrawlPage[] = [
  {
    path: "/",
    lastModified: latestDate([profile.updatedAt, ...projectDates, ...writingDates])
  },
  {
    path: "/about",
    lastModified: profile.updatedAt
  },
  {
    path: "/resume",
    lastModified: resume.updatedAt
  },
  {
    path: "/resume.pdf",
    lastModified: resume.pdfUpdatedAt
  },
  {
    path: "/work",
    lastModified: latestDate(projectDates)
  },
  {
    path: "/writing",
    lastModified: latestDate(writingDates)
  }
];

export function getCrawlPages(): readonly CrawlPage[] {
  return [
    ...indexPages,
    ...projects.map((project) => ({
      path: `/work/${project.slug}`,
      lastModified: project.caseStudy.lastUpdated
    })),
    ...writingArticles.map((article) => ({
      path: `/writing/${article.slug}`,
      lastModified: article.updatedAt
    }))
  ];
}

export function createLlmsText() {
  const canonicalPages = [
    ["About", "/about"],
    ["Resume", "/resume"],
    ["Work", "/work"],
    ["Writing", "/writing"]
  ] as const;

  const caseStudies = projects.slice(0, 5);

  return `${[
    `# ${site.name}`,
    "",
    `> ${defaultDescription} This website is his portfolio of engineering case studies, technical writing, and professional experience.`,
    "",
    "## Canonical pages",
    "",
    ...canonicalPages.map(([label, path]) => `- [${label}](${getAbsoluteUrl(path)})`),
    "",
    "## Selected case studies",
    "",
    ...caseStudies.map(
      (project) =>
        `- [${project.title}](${getAbsoluteUrl(`/work/${project.slug}`)}): ${project.shortDescription}`
    ),
    "",
    "## Technical articles",
    "",
    ...writingArticles.map(
      (article) =>
        `- [${article.title}](${getAbsoluteUrl(`/writing/${article.slug}`)}): ${article.description}`
    ),
    ""
  ].join("\n")}\n`;
}
