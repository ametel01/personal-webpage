import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { TechIcon } from "@/components/tech-icons";

type ElementProps<T extends HTMLElement> = HTMLAttributes<T> & {
  children: ReactNode;
};

export function Container({ children, className = "", ...props }: ElementProps<HTMLDivElement>) {
  return (
    <div className={["container", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

type SectionProps = ElementProps<HTMLElement> & {
  muted?: boolean;
  tight?: boolean;
};

export function Section({
  children,
  className = "",
  muted = false,
  tight = false,
  ...props
}: SectionProps) {
  const classes = [
    tight ? "section-tight" : "section",
    muted ? "muted-band" : "",
    className
  ].filter(Boolean);

  return (
    <section className={classes.join(" ")} {...props}>
      {children}
    </section>
  );
}

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

export function ExternalLink({ children, ...props }: ExternalLinkProps) {
  return (
    <a target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  );
}

type TagListProps = {
  items: readonly string[];
  ariaLabel?: string;
};

export function TagList({ items, ariaLabel = "Technologies" }: TagListProps) {
  return (
    <ul className="tech-tag-list" aria-label={ariaLabel}>
      {items.map((item) => (
        <li className="tech-tag" key={item}>
          <TechIcon name={item} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
