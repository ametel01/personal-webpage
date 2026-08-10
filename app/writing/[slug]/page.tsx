import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/primitives";
import { StructuredData } from "@/components/structured-data";
import {
  ArticleCodeExamples,
  ArticleDecisionLog,
  ArticleDiagram,
  ArticleFailureCases,
  ArticleRepositoryLinks
} from "@/components/writing-evidence";
import { getRelatedProjectsForArticle } from "@/content/relationships";
import {
  getRelatedWriting,
  getWritingArticle,
  isWritingSlug,
  type WritingArticle,
  type WritingParagraph,
  writingSlugs
} from "@/content/writing";
import { createPageMetadata } from "@/lib/metadata";
import { createWritingArticleStructuredData } from "@/lib/structured-data";
import { formatWritingDate } from "@/lib/writing";

type WritingArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return writingSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: WritingArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isWritingSlug(slug)) {
    return { title: "Article Not Found" };
  }

  const article = getWritingArticle(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return createPageMetadata({
    title: article.title,
    description: article.description,
    path: `/writing/${article.slug}`,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt
  });
}

export default async function WritingArticlePage({ params }: WritingArticlePageProps) {
  const { slug } = await params;

  if (!isWritingSlug(slug)) {
    notFound();
  }

  const article = getWritingArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedWriting = getRelatedWriting(article);
  const relatedProjects = getRelatedProjectsForArticle(article);

  return (
    <main className="writing-article-page" id="main-content" tabIndex={-1}>
      <StructuredData data={createWritingArticleStructuredData(article)} />
      <article>
        <Section className="writing-article-hero">
          <Container>
            <Link className="writing-back-link" href="/writing">
              <ArrowLeft aria-hidden="true" size={16} strokeWidth={2.2} />
              Technical writing
            </Link>
            <header className="writing-article-header">
              <h1>{article.title}</h1>
              <p className="writing-article-topic">{article.topic}</p>
              <p className="writing-article-dek">{article.description}</p>
              <p className="writing-article-meta writing-article-hero-meta">
                <span>
                  <Clock3 aria-hidden="true" size={17} strokeWidth={1.9} />
                  {article.readingMinutes} min read
                </span>
                <span>
                  <CalendarDays aria-hidden="true" size={17} strokeWidth={1.9} />
                  Published{" "}
                  <time dateTime={article.publishedAt}>
                    {formatWritingDate(article.publishedAt)}
                  </time>
                </span>
              </p>
            </header>
            <div className="writing-question-strip">
              <p>This guide answers</p>
              <ul>
                {article.searchQuestions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>

        <Section className="writing-article-body-section" muted>
          <Container>
            <div className="writing-article-layout">
              <ArticleTableOfContents article={article} />
              <div className="writing-article-content">
                <aside className="writing-key-points" aria-labelledby="key-points-title">
                  <h2 id="key-points-title">Key points</h2>
                  <ul>
                    {article.keyPoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </aside>

                {article.sections.map((section, index) => (
                  <div key={section.id}>
                    <section className="writing-prose-section" id={section.id}>
                      <h2>{section.title}</h2>
                      {section.paragraphs.map((paragraph) => (
                        <ArticleParagraph
                          key={typeof paragraph === "string" ? paragraph : paragraph.text}
                          paragraph={paragraph}
                        />
                      ))}
                      {section.items ? (
                        <div className="writing-checklist">
                          {section.listTitle ? <h3>{section.listTitle}</h3> : null}
                          <ul>
                            {section.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </section>
                    {index === 1 ? <ArticleDiagram diagram={article.diagram} /> : null}
                  </div>
                ))}

                <ArticleCodeExamples examples={article.codeExamples} />
                <ArticleDecisionLog decisions={article.decisions} />
                <ArticleFailureCases cases={article.failureCases} />
                <ArticleRepositoryLinks links={article.repositoryLinks} />

                <section
                  className="writing-project-callout"
                  aria-labelledby="related-projects-title"
                >
                  <h2 id="related-projects-title">Related projects</h2>
                  <p>Inspect the systems that ground this guide in implementation work.</p>
                  <ul>
                    {relatedProjects.map((project) => (
                      <li key={project.slug}>
                        <Link href={`/work/${project.slug}`} prefetch={false}>
                          <span>{project.tags.slice(0, 3).join(" · ")}</span>
                          <strong>{project.title}</strong>
                          <span className="writing-project-summary">
                            {project.shortDescription}
                          </span>
                          <ArrowRight aria-hidden="true" size={18} strokeWidth={2} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>

                <section
                  className="writing-related-section"
                  aria-labelledby="related-writing-title"
                >
                  <h2 id="related-writing-title">Continue reading</h2>
                  <ul>
                    {relatedWriting.map((relatedArticle) => (
                      <li key={relatedArticle.slug}>
                        <Link href={`/writing/${relatedArticle.slug}`}>
                          <span>{relatedArticle.topic}</span>
                          <strong className="writing-related-title">{relatedArticle.title}</strong>
                          <ArrowRight aria-hidden="true" size={18} strokeWidth={2} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>

                <p className="writing-updated-date">
                  Last updated:{" "}
                  <time dateTime={article.updatedAt}>{formatWritingDate(article.updatedAt)}</time>
                </p>
              </div>
            </div>
          </Container>
        </Section>
      </article>
    </main>
  );
}

function ArticleParagraph({ paragraph }: { paragraph: WritingParagraph }) {
  if (typeof paragraph === "string") {
    return <p>{paragraph}</p>;
  }

  return (
    <p>
      {paragraph.text}{" "}
      <span className="writing-inline-citations">
        Sources:{" "}
        {paragraph.citations.map((citation, index) => (
          <span key={citation.href}>
            {index > 0 ? ", " : null}
            <a href={citation.href} rel="noreferrer" target="_blank">
              {citation.label}
            </a>
          </span>
        ))}
        .
      </span>
    </p>
  );
}

function ArticleTableOfContents({ article }: { article: WritingArticle }) {
  return (
    <nav className="writing-article-toc" aria-label={`${article.title} sections`}>
      <p>In this guide</p>
      <ol>
        {article.sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>{section.title}</a>
          </li>
        ))}
        <li>
          <a href="#implementation">Implementation examples</a>
        </li>
        <li>
          <a href="#decisions">Decision log</a>
        </li>
        <li>
          <a href="#failure-cases">Failure cases</a>
        </li>
        <li>
          <a href="#repositories">Repositories</a>
        </li>
      </ol>
    </nav>
  );
}
