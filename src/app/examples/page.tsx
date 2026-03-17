"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { examples } from "@/lib/examples";

export default function ExamplesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = examples[activeIndex];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-4">Examples</h1>
        <p className="text-muted max-w-2xl leading-relaxed">
          Real-world{" "}
          <code className="font-mono text-sm text-foreground bg-surface px-1.5 py-0.5 rounded border border-border">
            agent.json
          </code>{" "}
          files for different industries. Copy, adapt, and ship.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-border">
        {examples.map((example, i) => (
          <button
            key={example.title}
            onClick={() => setActiveIndex(i)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer ${
              i === activeIndex
                ? "text-foreground border-accent"
                : "text-muted border-transparent hover:text-foreground hover:border-border"
            }`}
          >
            {example.title}
          </button>
        ))}
      </div>

      {/* Active example */}
      <div>
        <div className="mb-6">
          <p className="text-muted text-sm leading-relaxed">
            {active.description}
          </p>
        </div>
        <CodeBlock code={active.code} title={active.filename} />
      </div>
    </div>
  );
}
