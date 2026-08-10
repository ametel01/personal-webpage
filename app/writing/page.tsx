import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/primitives";
import { StructuredData } from "@/components/structured-data";
import {
  getWritingTopicGroups,
  type WritingArticle,
  type WritingTopicGroup,
  writingArticles
} from "@/content/writing";
import { createPageMetadata } from "@/lib/metadata";
import { createWritingIndexStructuredData } from "@/lib/structured-data";
import { formatWritingDate } from "@/lib/writing";

export const metadata: Metadata = createPageMetadata({
  title: "Software Engineering Articles",
  description:
    "Implementation-led guides on coding-agent evidence, replay, Agent Skill audits, Starknet source verification, local-first tools, and cross-chain testing.",
  path: "/writing"
});

const writingStructuredData = createWritingIndexStructuredData(writingArticles);

export default function WritingPage() {
  const featuredArticle = writingArticles[0];
  const supportingArticles = writingArticles.slice(1);
  const topicGroups = getWritingTopicGroups();

  return (
    <main className="writing-page" id="main-content" tabIndex={-1}>
      <StructuredData data={writingStructuredData} />
      <Section className="writing-index-section">
        <Container>
          <header className="writing-index-header">
            <h1>Field notes on building systems that can be inspected, tested, and trusted.</h1>
            <p>
              Practical guides to systems engineering, verification, and developer infrastructure.
              Clear enough to implement, detailed enough to stand up to scrutiny.
            </p>
          </header>

          <div className="writing-atlas-layout">
            <FeaturedWritingCard article={featuredArticle} />
            <TopicAtlas topics={topicGroups} />
          </div>

          <section className="writing-index-list" aria-label="All technical articles">
            {supportingArticles.map((article) => (
              <WritingRow article={article} key={article.slug} />
            ))}
          </section>
        </Container>
      </Section>
    </main>
  );
}

function FeaturedWritingCard({ article }: { article: WritingArticle }) {
  return (
    <article className="writing-featured-article" id={`article-${article.slug}`}>
      <Link className="writing-featured-link" href={`/writing/${article.slug}`}>
        <ContourLines />
        <div className="writing-featured-copy">
          <h2>{article.title}</h2>
          <p className="writing-featured-label">Featured guide</p>
          <p>{article.description}</p>
          <span className="writing-read-link">
            Read the guide
            <ArrowRight aria-hidden="true" size={18} strokeWidth={2.2} />
          </span>
          <ArticleMeta article={article} />
        </div>
      </Link>
    </article>
  );
}

function ContourLines() {
  return (
    <svg aria-hidden="true" className="writing-contours" focusable="false" viewBox="0 0 360 520">
      <g fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M106-24c44 53 70 82 66 126-5 55-60 73-58 129 2 59 68 72 66 130-2 48-50 74-66 120-12 34-4 67 18 91" />
        <path d="M132-24c42 48 66 80 61 122-7 53-60 75-56 131 4 54 64 70 63 128-1 51-45 78-59 124-11 35-2 66 20 91" />
        <path d="M158-24c39 45 62 77 57 119-7 50-57 76-52 132 5 50 60 68 59 126-1 54-41 82-52 128-9 35 1 65 22 91" />
        <path d="M184-24c38 44 58 76 52 116-7 48-53 77-47 133 6 47 56 67 55 124-1 56-36 85-46 132-7 35 4 64 25 91" />
        <path d="M210-24c36 43 54 74 48 113-8 46-50 78-43 134 6 43 52 64 51 122-1 58-33 89-40 136-5 35 7 63 28 91" />
        <path d="M236-24c34 42 50 72 44 110-8 44-46 79-39 134 7 41 48 62 47 121-1 59-29 92-35 140-4 35 9 62 31 91" />
        <path d="M262-24c32 40 46 70 40 107-8 42-43 80-35 135 7 38 44 60 43 118-1 62-25 96-29 145-3 34 11 60 33 91" />
        <path d="M288-24c30 39 42 68 36 104-8 40-39 81-31 135 7 35 40 58 39 117-1 63-21 99-23 149-1 34 13 59 35 91" />
        <path d="M314-24c28 38 38 66 32 101-8 38-36 82-27 135 7 33 36 56 35 116-1 65-17 102-17 153 0 33 15 57 37 91" />
        <path d="M340-24c26 36 34 64 28 98-8 36-32 83-23 136 6 30 32 53 31 113-1 68-13 107-11 158 1 32 17 56 39 91" />
      </g>
    </svg>
  );
}

function TopicAtlas({ topics }: { topics: readonly WritingTopicGroup[] }) {
  return (
    <aside className="writing-topic-atlas" aria-labelledby="topic-atlas-title">
      <div className="writing-topic-heading">
        <h2 id="topic-atlas-title">Topic atlas</h2>
        <p>Explore the current field notes by topic.</p>
      </div>
      <span aria-hidden="true" className="writing-atlas-bridge" />
      <ol className="writing-topic-list">
        {topics.map((topic) => (
          <li key={topic.topic}>
            <Link href={`/writing/${topic.firstArticleSlug}`}>
              <span className="writing-topic-title">{topic.topic}</span>
              <span className="writing-topic-description">{topic.description}</span>
              <span className="writing-topic-count">
                {topic.count} {topic.count === 1 ? "field note" : "field notes"}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function WritingRow({ article }: { article: WritingArticle }) {
  return (
    <article className="writing-index-row" id={`article-${article.slug}`}>
      <Link href={`/writing/${article.slug}`}>
        <div className="writing-row-title">
          <h2>{article.title}</h2>
          <p>{article.topic}</p>
        </div>
        <p className="writing-row-description">{article.description}</p>
        <ArticleMeta article={article} />
        <ArrowRight aria-hidden="true" className="writing-row-arrow" size={26} strokeWidth={1.8} />
      </Link>
    </article>
  );
}

function ArticleMeta({ article }: { article: WritingArticle }) {
  return (
    <p className="writing-article-meta">
      <span>
        <Clock3 aria-hidden="true" size={17} strokeWidth={1.9} />
        {article.readingMinutes} min read
      </span>
      <span>
        <CalendarDays aria-hidden="true" size={17} strokeWidth={1.9} />
        <time dateTime={article.publishedAt}>{formatWritingDate(article.publishedAt)}</time>
      </span>
    </p>
  );
}
