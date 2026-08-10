import {
  ArrowDown,
  ArrowUpRight,
  CircleAlert,
  Code2,
  Download,
  FileJson2,
  GitBranch,
  Network,
  Route,
  Scale,
  ShieldAlert,
  TableProperties,
  Workflow
} from "lucide-react";
import type { ReactNode } from "react";
import type {
  WritingArtifact,
  WritingCodeExample,
  WritingDecision,
  WritingDiagram,
  WritingFailureCase,
  WritingRepositoryLink
} from "@/content/writing";

const artifactLabels: Record<WritingArtifact["kind"], string> = {
  schema: "Receipt schema",
  architecture: "Architecture diagram",
  "state-machine": "State machine",
  "failure-taxonomy": "Failure taxonomy",
  pipeline: "Verification pipeline",
  download: "Downloadable fixture",
  implementation: "Minimal implementation",
  comparison: "Engineering comparison"
};

const artifactIcons = {
  schema: FileJson2,
  architecture: Network,
  "state-machine": Workflow,
  "failure-taxonomy": ShieldAlert,
  pipeline: Route,
  download: Download,
  implementation: Code2,
  comparison: TableProperties
} as const;

export function ArticleDiagram({ diagram }: { diagram: WritingDiagram }) {
  return (
    <figure className="writing-process-diagram">
      <figcaption>
        <span>System diagram</span>
        <strong>{diagram.title}</strong>
        <div>
          <p>{diagram.description}</p>
          <a href={diagram.source.href} rel="noreferrer" target="_blank">
            Source: {diagram.source.label}
            <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} />
          </a>
        </div>
      </figcaption>
      <ol>
        {diagram.steps.map((step, index) => (
          <li key={step.label}>
            <span className="writing-diagram-index">{String(index + 1).padStart(2, "0")}</span>
            <strong>{step.label}</strong>
            <span>{step.detail}</span>
            {index < diagram.steps.length - 1 ? (
              <ArrowDown aria-hidden="true" className="writing-diagram-arrow" size={18} />
            ) : null}
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function ArticleArtifacts({ artifacts }: { artifacts: readonly WritingArtifact[] }) {
  return (
    <>
      {artifacts.map((artifact) => (
        <ArticleArtifact artifact={artifact} key={artifact.id} />
      ))}
    </>
  );
}

function ArticleArtifact({ artifact }: { artifact: WritingArtifact }) {
  const Icon = artifactIcons[artifact.kind];

  return (
    <section className={`writing-artifact writing-artifact-${artifact.kind}`} id={artifact.id}>
      <header className="writing-artifact-header">
        <Icon aria-hidden="true" size={22} strokeWidth={1.7} />
        <div>
          <h2>{artifact.title}</h2>
          <p>{artifact.description}</p>
          <div className="writing-artifact-meta">
            <span>{artifactLabels[artifact.kind]}</span>
            <a href={artifact.source.href} rel="noreferrer" target="_blank">
              Derived from {artifact.source.label}
              <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} />
            </a>
          </div>
        </div>
      </header>
      <ArtifactBody artifact={artifact} />
    </section>
  );
}

function ArtifactBody({ artifact }: { artifact: WritingArtifact }) {
  switch (artifact.kind) {
    case "schema":
      return (
        <div className="writing-artifact-body writing-schema-layout">
          <ArtifactCode filename={artifact.filename} language="json" code={artifact.code} />
          <ArtifactTable caption={`${artifact.title} fields`} className="writing-schema-table">
            <thead>
              <tr>
                <th scope="col">Path</th>
                <th scope="col">Type</th>
                <th scope="col">Requirement</th>
                <th scope="col">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {artifact.fields.map((field) => (
                <tr key={field.path}>
                  <th scope="row">{field.path}</th>
                  <td>{field.type}</td>
                  <td>{field.requirement}</td>
                  <td>{field.purpose}</td>
                </tr>
              ))}
            </tbody>
          </ArtifactTable>
        </div>
      );
    case "architecture":
      return (
        <div className="writing-artifact-body">
          <div className="writing-architecture-lanes">
            {artifact.lanes.map((lane, index) => (
              <section key={lane.label}>
                <div className="writing-architecture-lane-heading">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{lane.label}</h3>
                  <p>{lane.responsibility}</p>
                </div>
                <ul>
                  {lane.nodes.map((node) => (
                    <li key={node}>{node}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <ol className="writing-architecture-flows">
            {artifact.flows.map((flow) => (
              <li key={flow}>{flow}</li>
            ))}
          </ol>
        </div>
      );
    case "state-machine":
      return (
        <div className="writing-artifact-body">
          <ol className="writing-state-machine">
            {artifact.states.map((state) => (
              <li key={state.name}>
                <div className="writing-state-heading">
                  <strong>{state.name}</strong>
                  <span>{state.mode}</span>
                </div>
                <p>{state.description}</p>
                <ul>
                  {state.transitions.map((transition) => (
                    <li key={transition}>{transition}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      );
    case "failure-taxonomy":
      return (
        <div className="writing-artifact-body">
          <ArtifactTable caption={artifact.title} className="writing-taxonomy-table">
            <thead>
              <tr>
                <th scope="col">Failure class</th>
                <th scope="col">Trigger</th>
                <th scope="col">Boundary</th>
                <th scope="col">Disposition</th>
              </tr>
            </thead>
            <tbody>
              {artifact.cases.map((item) => (
                <tr key={item.class}>
                  <th scope="row">{item.class}</th>
                  <td>{item.trigger}</td>
                  <td>{item.boundary}</td>
                  <td>{item.disposition}</td>
                </tr>
              ))}
            </tbody>
          </ArtifactTable>
        </div>
      );
    case "pipeline":
      return (
        <div className="writing-artifact-body">
          <ol className="writing-verification-pipeline">
            {artifact.stages.map((stage, index) => (
              <li key={stage.stage}>
                <div className="writing-pipeline-stage">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{stage.stage}</strong>
                </div>
                <dl>
                  <div>
                    <dt>Input</dt>
                    <dd>{stage.input}</dd>
                  </div>
                  <div>
                    <dt>Assertion</dt>
                    <dd>{stage.assertion}</dd>
                  </div>
                  <div>
                    <dt>Output</dt>
                    <dd>{stage.output}</dd>
                  </div>
                  <div>
                    <dt>Failure</dt>
                    <dd>{stage.failure}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </div>
      );
    case "download":
      return (
        <div className="writing-artifact-body writing-download-layout">
          <a className="writing-download-link" download href={artifact.href}>
            <Download aria-hidden="true" size={25} strokeWidth={1.8} />
            <span>
              <strong>{artifact.filename}</strong>
              <span>{artifact.mediaType}</span>
            </span>
            <ArrowDown aria-hidden="true" size={18} strokeWidth={2} />
          </a>
          <ArtifactCode filename="fixture preview" language="json" code={artifact.preview} />
          <ul className="writing-artifact-checks">
            {artifact.checks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ul>
        </div>
      );
    case "implementation":
      return (
        <div className="writing-artifact-body writing-implementation-layout">
          <ArtifactCode
            filename={artifact.filename}
            language={artifact.language}
            code={artifact.code}
          />
          <div className="writing-implementation-guarantees">
            <h3>What this minimal boundary guarantees</h3>
            <ul>
              {artifact.guarantees.map((guarantee) => (
                <li key={guarantee}>{guarantee}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "comparison":
      return (
        <div className="writing-artifact-body">
          <ArtifactTable caption={artifact.title} className="writing-comparison-table">
            <thead>
              <tr>
                <th scope="col">Criterion</th>
                {artifact.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {artifact.rows.map((row) => (
                <tr key={row.criterion}>
                  <th scope="row">{row.criterion}</th>
                  {row.values.map((value, index) => (
                    <td key={`${artifact.columns[index]}-${value}`}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </ArtifactTable>
        </div>
      );
  }
}

function ArtifactCode({
  filename,
  language,
  code
}: {
  filename: string;
  language: string;
  code: string;
}) {
  return (
    <figure className="writing-artifact-code">
      <figcaption>
        <span className="writing-artifact-code-filename">{filename}</span>
        <span className="writing-artifact-code-language">{language}</span>
      </figcaption>
      <ScrollableCode
        className="writing-artifact-code-scroll"
        code={code}
        label={`${filename} source code`}
      />
    </figure>
  );
}

function ScrollableCode({
  label,
  className,
  code
}: {
  label: string;
  className: string;
  code: string;
}) {
  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: The named overflow region must be keyboard-scrollable.
    <section aria-label={label} className={className} tabIndex={0}>
      <pre>
        <code>{code}</code>
      </pre>
    </section>
  );
}

function ArtifactTable({
  caption,
  className,
  children
}: {
  caption: string;
  className: string;
  children: ReactNode;
}) {
  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: The named overflow region must be keyboard-scrollable.
    <section aria-label={`${caption} table`} className="writing-artifact-table-wrap" tabIndex={0}>
      <table className={className}>
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </section>
  );
}

export function ArticleCodeExamples({ examples }: { examples: readonly WritingCodeExample[] }) {
  return (
    <section className="writing-code-section" id="implementation">
      <div className="writing-evidence-heading">
        <GitBranch aria-hidden="true" size={20} strokeWidth={1.8} />
        <div>
          <h2>Implementation examples</h2>
          <p>Concrete commands and data shapes you can adapt.</p>
        </div>
      </div>
      <div className="writing-code-list">
        {examples.map((example) => (
          <figure className="writing-code-example" key={example.label}>
            <figcaption>
              <span>{example.label}</span>
              <span className="writing-code-language">{example.language}</span>
            </figcaption>
            <ScrollableCode
              className="writing-code-scroll"
              code={example.code}
              label={`${example.label} source code`}
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

export function ArticleDecisionLog({ decisions }: { decisions: readonly WritingDecision[] }) {
  return (
    <section className="writing-decision-section" id="decisions">
      <div className="writing-evidence-heading">
        <Scale aria-hidden="true" size={20} strokeWidth={1.8} />
        <div>
          <h2>Decision log</h2>
          <p>The choices that shape the design—and what each choice costs.</p>
        </div>
      </div>
      <ol className="writing-decision-list">
        {decisions.map((decision) => (
          <li key={decision.decision}>
            <strong>{decision.decision}</strong>
            <p>{decision.rationale}</p>
            <span>Tradeoff: {decision.tradeoff}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ArticleFailureCases({ cases }: { cases: readonly WritingFailureCase[] }) {
  return (
    <section className="writing-failure-section" id="failure-cases">
      <div className="writing-evidence-heading">
        <CircleAlert aria-hidden="true" size={20} strokeWidth={1.8} />
        <div>
          <h2>Failure cases</h2>
          <p>What breaks, how it presents, and the recovery boundary.</p>
        </div>
      </div>
      <dl className="writing-failure-list">
        {cases.map((item) => (
          <div className="writing-failure-row" key={item.failure}>
            <dt>{item.failure}</dt>
            <dd>
              <span>Signal</span>
              <p>{item.signal}</p>
            </dd>
            <dd>
              <span>Response</span>
              <p>{item.response}</p>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ArticleRepositoryLinks({ links }: { links: readonly WritingRepositoryLink[] }) {
  return (
    <section className="writing-repository-section" id="repositories">
      <div className="writing-evidence-heading">
        <GitBranch aria-hidden="true" size={20} strokeWidth={1.8} />
        <div>
          <h2>Repositories and primary references</h2>
          <p>Read the implementation, specifications, and tool documentation behind the article.</p>
        </div>
      </div>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} rel="noreferrer" target="_blank">
              <strong>{link.label}</strong>
              <span>{link.description}</span>
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2} />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
