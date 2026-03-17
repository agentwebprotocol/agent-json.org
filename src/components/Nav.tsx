"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/schema", label: "Schema" },
  { href: "/examples", label: "Examples" },
  { href: "/validate", label: "Validate" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight flex items-center gap-2"
        >
          <span className="text-accent">{`{`}</span>
          <span>agent.json</span>
          <span className="text-accent">{`}`}</span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                pathname === link.href
                  ? "text-foreground bg-surface-hover"
                  : "text-muted hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/agentwebprotocol/agent.json"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-3 py-1.5 rounded-md text-sm text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
