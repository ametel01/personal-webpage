import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

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
    <ul className="flex flex-wrap gap-2" aria-label={ariaLabel}>
      {items.map((item) => (
        <li
          className="rounded-[6px] bg-[var(--color-tag-bg)] px-2.5 py-1 text-[length:var(--text-xs)] font-semibold text-[var(--color-tag-text)]"
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-4 text-[length:var(--text-sm)] font-bold uppercase text-[var(--color-text-muted)]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-balance text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] text-[var(--color-text)] max-[720px]:text-[length:var(--text-3xl)]">
        {title}
      </h1>
      {description ? (
        <p className="mt-5 text-[length:var(--text-lg)] leading-8 text-[var(--color-text-muted)]">
          {description}
        </p>
      ) : null}
    </header>
  );
}
