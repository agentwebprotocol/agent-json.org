import { CodeBlock } from "@/components/CodeBlock";
import Link from "next/link";

const minimalExample = `{
  "awp_version": "0.2",
  "domain": "example.com",
  "intent": "Example service — search, retrieve, and buy items. Agents can help users find and purchase what they need.",
  "protocols": {
    "mcp": {
      "version": "2025-06-18",
      "endpoint": "https://mcp.example.com",
      "transport": "http"
    },
    "a2a": {
      "version": "0.3",
      "endpoint": "https://agent.example.com/agent/message"
    }
  },
  "capabilities": {
    "streaming": false,
    "pagination": "cursor",
    "idempotency": true
  },
  "auth": {
    "required_for": ["create_item"],
    "optional_for": ["search"],
    "type": "api_key"
  },
  "actions": [
    {
      "id": "search",
      "description": "Search for items by keyword",
      "auth_required": false,
      "inputs": {
        "query": { "type": "string", "required": true }
      },
      "outputs": {
        "items": "array[item]",
        "total": "integer"
      },
      "endpoint": "/api/search",
      "method": "POST",
      "rate_limit": "60/minute",
      "execution_model": "sync"
    },
    {
      "id": "buy_item",
      "description": "Buy an item — routes through the MCP server",
      "via": "mcp",
      "operation": "create_payment_link"
    }
  ],
  "agent_status": {
    "operational": true,
    "status_endpoint": "/api/status"
  }
}`;

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Agent Web Protocol v1.0
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
              Make any website{" "}
              <span className="text-accent">agent-ready</span>
            </h1>

            <p className="text-lg text-muted leading-relaxed mb-4 max-w-2xl">
              <code className="text-foreground font-mono text-base bg-surface px-2 py-0.5 rounded border border-border">
                agent.json
              </code>{" "}
              is a machine-readable manifest that tells AI agents what your
              service does, how to authenticate, and what actions are available
              — in a single file at your domain root.
            </p>

            <p className="text-muted leading-relaxed mb-8 max-w-2xl">
              Like{" "}
              <code className="font-mono text-sm text-muted">robots.txt</code>{" "}
              told crawlers where to go,{" "}
              <code className="font-mono text-sm text-foreground">
                agent.json
              </code>{" "}
              tells agents what to do.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/schema"
                className="px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                View Schema
              </Link>
              <Link
                href="/validate"
                className="px-5 py-2.5 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors"
              >
                Validate Your File
              </Link>
              <a
                href="https://agentwebprotocol.org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors text-muted"
              >
                Full Spec &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Quick start</h2>
            <p className="text-muted mb-6 leading-relaxed">
              Place an{" "}
              <code className="font-mono text-sm text-foreground bg-surface px-1.5 py-0.5 rounded border border-border">
                agent.json
              </code>{" "}
              file at your domain root. That&apos;s it. Any AWP-compatible agent
              can discover your service and understand how to interact with it.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-accent text-sm font-mono font-bold">
                    1
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">Describe your service</p>
                  <p className="text-muted text-sm">
                    Set your domain, intent, and capabilities.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-accent text-sm font-mono font-bold">
                    2
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">Define your actions</p>
                  <p className="text-muted text-sm">
                    List API endpoints agents can call, with parameters and
                    return types.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-accent text-sm font-mono font-bold">
                    3
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">
                    Serve at{" "}
                    <code className="font-mono text-xs">
                      yourdomain.com/agent.json
                    </code>
                  </p>
                  <p className="text-muted text-sm">
                    Agents discover it automatically. No registration needed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <CodeBlock
              code={minimalExample}
              title="example.com/agent.json"
            />
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Discovery",
              description:
                "Agents fetch /agent.json from any domain — no registry, no middleman. Decentralized by design.",
              icon: "/",
            },
            {
              title: "Self-describing",
              description:
                "Natural-language intent plus structured schemas. Agents understand both what you do and how to do it.",
              icon: "{}",
            },
            {
              title: "Auth-aware",
              description:
                "Declare your auth method once. OAuth 2.0, API keys, bearer tokens — agents know what to bring.",
              icon: "~",
            },
            {
              title: "Action-oriented",
              description:
                "Every endpoint is an action with typed parameters. Agents can plan and execute multi-step workflows.",
              icon: ">",
            },
            {
              title: "Error contracts",
              description:
                "Domain-specific error codes with retry hints. Agents handle failures gracefully.",
              icon: "!",
            },
            {
              title: "Status signals",
              description:
                "Active, beta, maintenance, deprecated — agents adapt their behavior to your service state.",
              icon: "*",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-4 font-mono text-accent text-sm">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CLI */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent mb-16" />

        <h2 className="text-2xl font-semibold mb-4">Install the CLI</h2>
        <p className="text-muted leading-relaxed mb-8 max-w-2xl">
          Generate and validate{" "}
          <code className="font-mono text-sm text-foreground bg-surface px-1.5 py-0.5 rounded border border-border">
            agent.json
          </code>{" "}
          from your terminal.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0c0c12] border-b border-border">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#27272a]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27272a]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27272a]" />
              </div>
              <span className="text-xs text-muted font-mono ml-2">
                Generate a manifest
              </span>
            </div>
            <div className="bg-[#0c0c12] px-4 py-4">
              <code className="font-mono text-sm text-foreground">
                <span className="text-muted">$</span> npx agent-json init
              </code>
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0c0c12] border-b border-border">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#27272a]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27272a]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27272a]" />
              </div>
              <span className="text-xs text-muted font-mono ml-2">
                Validate a manifest
              </span>
            </div>
            <div className="bg-[#0c0c12] px-4 py-4">
              <code className="font-mono text-sm text-foreground">
                <span className="text-muted">$</span> npx agent-json validate
                agent.json
              </code>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted">
          Zero dependencies. Works instantly via npx. Published at{" "}
          <a
            href="https://www.npmjs.com/package/agent-json"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            npmjs.com/package/agent-json
          </a>
          .
        </p>
      </section>
    </div>
  );
}
