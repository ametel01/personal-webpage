import { ArrowDown, ArrowUpRight, CircleAlert, GitBranch, Scale } from "lucide-react";
import type {
  WritingCodeExample,
  WritingDecision,
  WritingDiagram,
  WritingFailureCase,
  WritingRepositoryLink
} from "@/content/writing";

export function ArticleDiagram({ diagram }: { diagram: WritingDiagram }) {
  return (
    <figure className="writing-process-diagram">
      <figcaption>
        <span>System diagram</span>
        <strong>{diagram.title}</strong>
        <p>{diagram.description}</p>
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
            <pre>
              <code>{example.code}</code>
            </pre>
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
