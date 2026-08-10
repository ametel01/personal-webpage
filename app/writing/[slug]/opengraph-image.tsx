import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getWritingArticle, writingArticles } from "@/content/writing";

const sourceSerif = readFile(
  join(
    process.cwd(),
    "node_modules/@fontsource/source-serif-4/files/source-serif-4-latin-600-normal.woff"
  )
);

export const alt = "Alex Metelli technical field note";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";
export const runtime = "nodejs";

type OpenGraphImageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { slug } = await params;
  const article = getWritingArticle(slug);
  const articleIndex = writingArticles.findIndex((candidate) => candidate.slug === slug);
  const title = article?.title ?? "Technical writing";
  const topic = article?.topic ?? "Engineering field notes";
  const readingTime = article ? `${article.readingMinutes} min read` : "Alex Metelli";
  const plateNumber = String(Math.max(articleIndex + 1, 1)).padStart(2, "0");
  const titleSize = title.length > 52 ? 58 : title.length > 40 ? 64 : 72;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "#fbfaf7",
        color: "#101b33",
        padding: "64px 72px"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "34px",
          display: "flex",
          border: "1px solid #d7dce5"
        }}
      />
      <svg
        aria-hidden="true"
        width="430"
        height="630"
        viewBox="0 0 360 520"
        style={{
          position: "absolute",
          right: "-12px",
          top: "0",
          opacity: 0.58
        }}
      >
        <g fill="none" stroke="#3657a3" strokeWidth="1.2">
          <path d="M106-24c44 53 70 82 66 126-5 55-60 73-58 129 2 59 68 72 66 130-2 48-50 74-66 120-12 34-4 67 18 91" />
          <path d="M132-24c42 48 66 80 61 122-7 53-60 75-56 131 4 54 64 70 63 128-1 51-45 78-59 124-11 35-2 66 20 91" />
          <path d="M158-24c39 45 62 77 57 119-7 50-57 76-52 132 5 50 60 68 59 126-1 54-41 82-52 128-9 35 1 65 22 91" />
          <path d="M184-24c38 44 58 76 52 116-7 48-53 77-47 133 6 47 56 67 55 124-1 56-36 85-46 132-7 35 4 64 25 91" />
          <path d="M210-24c36 43 54 74 48 113-8 46-50 78-43 134 6 43 52 64 51 122-1 58-33 89-40 136-5 35 7 63 28 91" />
          <path d="M236-24c34 42 50 72 44 110-8 44-46 79-39 134 7 41 48 62 47 121-1 59-29 92-35 140-4 35 9 62 31 91" />
          <path d="M262-24c32 40 46 70 40 107-8 42-43 80-35 135 7 38 44 60 43 118-1 62-25 96-29 145-3 34 11 60 33 91" />
          <path d="M288-24c30 39 42 68 36 104-8 40-39 81-31 135 7 35 40 58 39 117-1 63-21 99-23 149-1 34 13 59 35 91" />
          <path d="M314-24c28 38 38 66 32 101-8 38-36 82-27 135 7 33 36 56 35 116-1 65-17 102-17 153 0 33 15 57 37 91" />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          right: "34px",
          bottom: "34px",
          width: "430px",
          height: "108px",
          display: "flex",
          background: "#fbfaf7"
        }}
      />

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "72%",
            color: "#3657a3",
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}
        >
          <span>{topic}</span>
          <span style={{ marginInline: 16, color: "#a7b2c6" }}>·</span>
          <span>{readingTime}</span>
        </div>

        <div
          style={{
            width: "76%",
            flex: 1,
            display: "flex",
            alignItems: "center"
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Source Serif 4",
              fontSize: titleSize,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.035em"
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #a7b2c6",
            paddingTop: 20,
            fontSize: 20
          }}
        >
          <span style={{ fontWeight: 700 }}>Alex Metelli</span>
          <span style={{ color: "#526078" }}>Technical field note · {plateNumber}/07</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Source Serif 4",
          data: await sourceSerif,
          style: "normal",
          weight: 600
        }
      ]
    }
  );
}
