import type { Project } from "@/content/projects";
import { getCanonicalUrl, seoEntity } from "@/lib/seo";
import { site } from "@/lib/site";

type JsonLdNode = Record<string, unknown>;

export type StructuredDataGraph = {
  "@context": "https://schema.org";
  "@graph": JsonLdNode[];
};

const personReference = { "@id": seoEntity.personId } as const;
const websiteReference = { "@id": seoEntity.websiteId } as const;
const programmingLanguages = new Set(["Cairo", "Go", "Python", "Rust", "Solidity", "TypeScript"]);

function createGraph(...nodes: JsonLdNode[]): StructuredDataGraph {
  return {
    "@context": "https://schema.org",
    "@graph": nodes
  };
}

function getProjectId(project: Project) {
  return `${getCanonicalUrl(`/work/${project.slug}`)}#project`;
}

function getProgrammingLanguages(project: Project) {
  return project.metadata.stack.filter((technology) => programmingLanguages.has(technology));
}

function getCodeRepository(project: Project) {
  return project.caseStudy.evidence.find(
    ({ href }) => href.startsWith("https://github.com/") && !href.includes("/releases")
  )?.href;
}

function createBreadcrumbs(
  pageUrl: string,
  breadcrumbId: string,
  items: readonly { name: string; url: string }[]
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    })),
    mainEntityOfPage: pageUrl
  };
}

export function createHomepageStructuredData(): StructuredDataGraph {
  const homepageUrl = seoEntity.canonicalUrl;

  return createGraph(
    {
      "@type": "Person",
      "@id": seoEntity.personId,
      name: seoEntity.name,
      description: seoEntity.description,
      image: seoEntity.image,
      url: homepageUrl,
      jobTitle: seoEntity.occupation,
      hasOccupation: {
        "@type": "Occupation",
        name: seoEntity.occupation
      },
      email: `mailto:${site.email}`,
      knowsAbout: seoEntity.skills,
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: seoEntity.alumniOf
      },
      sameAs: seoEntity.sameAs,
      mainEntityOfPage: { "@id": seoEntity.profilePageId }
    },
    {
      "@type": "WebSite",
      "@id": seoEntity.websiteId,
      url: homepageUrl,
      name: `${seoEntity.name} — ${seoEntity.occupation}`,
      description: seoEntity.description,
      creator: personReference,
      author: personReference,
      publisher: personReference,
      inLanguage: "en"
    },
    {
      "@type": "ProfilePage",
      "@id": seoEntity.profilePageId,
      url: homepageUrl,
      name: `${seoEntity.name} — ${seoEntity.occupation}`,
      description: seoEntity.description,
      image: seoEntity.image,
      isPartOf: websiteReference,
      author: personReference,
      about: personReference,
      mainEntity: personReference,
      primaryImageOfPage: seoEntity.image,
      inLanguage: "en"
    }
  );
}

export function createWorkStructuredData(projects: readonly Project[]): StructuredDataGraph {
  const workUrl = getCanonicalUrl("/work");
  const pageId = `${workUrl}#collection-page`;
  const itemListId = `${workUrl}#project-list`;
  const breadcrumbId = `${workUrl}#breadcrumb`;

  return createGraph(
    {
      "@type": "CollectionPage",
      "@id": pageId,
      url: workUrl,
      name: `Selected Work — ${seoEntity.name}`,
      description:
        "Engineering case studies by Alex Metelli across AI tooling, developer infrastructure, product systems, Starknet verification, and cross-chain infrastructure.",
      isPartOf: websiteReference,
      author: personReference,
      about: personReference,
      mainEntity: { "@id": itemListId },
      breadcrumb: { "@id": breadcrumbId },
      inLanguage: "en"
    },
    {
      "@type": "ItemList",
      "@id": itemListId,
      name: "Alex Metelli project case studies",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        item: { "@id": getProjectId(project) }
      }))
    },
    createBreadcrumbs(workUrl, breadcrumbId, [
      { name: "Home", url: seoEntity.canonicalUrl },
      { name: "Work", url: workUrl }
    ])
  );
}

export function createProjectStructuredData(project: Project): StructuredDataGraph {
  const pageUrl = getCanonicalUrl(`/work/${project.slug}`);
  const pageId = `${pageUrl}#webpage`;
  const projectId = getProjectId(project);
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const codeRepository = getCodeRepository(project);
  const softwareDetails =
    project.schemaType === "SoftwareSourceCode"
      ? {
          codeRepository,
          programmingLanguage: getProgrammingLanguages(project),
          runtimePlatform: project.metadata.stack.join(", ")
        }
      : project.schemaType === "SoftwareApplication"
        ? {
            applicationCategory: project.applicationCategory,
            operatingSystem: "Web"
          }
        : {};

  return createGraph(
    {
      "@type": "WebPage",
      "@id": pageId,
      url: pageUrl,
      name: `${project.title} Case Study — ${seoEntity.name}`,
      description: project.shortDescription,
      isPartOf: websiteReference,
      author: personReference,
      about: { "@id": projectId },
      mainEntity: { "@id": projectId },
      breadcrumb: { "@id": breadcrumbId },
      dateModified: project.caseStudy.lastUpdated,
      citation: project.caseStudy.relatedWriting.map(({ href }) => href),
      inLanguage: "en"
    },
    {
      "@type": project.schemaType,
      "@id": projectId,
      name: project.title,
      description: project.shortDescription,
      url: pageUrl,
      image: getCanonicalUrl(project.icon.src),
      creator: personReference,
      author: personReference,
      keywords: project.tags,
      mainEntityOfPage: { "@id": pageId },
      dateModified: project.caseStudy.lastUpdated,
      citation: project.caseStudy.relatedWriting.map(({ href }) => href),
      sameAs: project.caseStudy.evidence.map(({ href }) => href),
      ...softwareDetails
    },
    createBreadcrumbs(pageUrl, breadcrumbId, [
      { name: "Home", url: seoEntity.canonicalUrl },
      { name: "Work", url: getCanonicalUrl("/work") },
      { name: project.title, url: pageUrl }
    ])
  );
}

export function serializeStructuredData(data: StructuredDataGraph) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
