export function Footer() {
  return (
    <footer className="border-t border-border py-12 mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <p className="font-mono text-sm font-semibold mb-2">
              <span className="text-accent">{`{`}</span> agent.json{" "}
              <span className="text-accent">{`}`}</span>
            </p>
            <p className="text-muted text-sm max-w-md">
              The machine-readable manifest that makes any website agent-ready.
              Part of Agent Web Protocol.
            </p>
          </div>

          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <p className="text-foreground font-medium mb-1">Resources</p>
              <a
                href="https://agentwebprotocol.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors"
              >
                Full Spec
              </a>
              <a
                href="https://github.com/agentwebprotocol/agent.json"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://github.com/agentwebprotocol/agent.json/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors"
              >
                Issues
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-foreground font-medium mb-1">Contact</p>
              <a
                href="mailto:spec@agentwebprotocol.org"
                className="text-muted hover:text-foreground transition-colors"
              >
                spec@agentwebprotocol.org
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-muted text-xs">
          Agent Web Protocol &middot; Open Standard
        </div>
      </div>
    </footer>
  );
}
