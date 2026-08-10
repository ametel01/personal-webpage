import { defaultDescription, site } from "@/lib/site";

const canonicalUrl = "https://www.ametel.dev/";
const profilePageUrl = new URL("/about", canonicalUrl).toString();

export const seoEntity = {
  personId: `${canonicalUrl}#alex-metelli`,
  websiteId: `${canonicalUrl}#website`,
  profilePageId: `${profilePageUrl}#profile-page`,
  name: site.name,
  description: defaultDescription,
  image: new URL("/images/professional-photo.png", canonicalUrl).toString(),
  occupation: site.role,
  skills: [
    "Backend systems",
    "Developer infrastructure",
    "Developer tooling",
    "AI tooling",
    "Agent workflows",
    "Blockchain infrastructure",
    "Starknet",
    "Cairo",
    "Solidity",
    "TypeScript",
    "Rust",
    "Python"
  ],
  canonicalUrl,
  sameAs: [site.githubUrl, site.linkedinUrl],
  alumniOf: "Birkbeck, University of London"
} as const;

export function getCanonicalUrl(path: string) {
  return new URL(path, seoEntity.canonicalUrl).toString();
}
