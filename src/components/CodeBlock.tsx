"use client";

import { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-json";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = "json", title }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#0c0c12] border border-b-0 border-border rounded-t-xl">
          <span className="text-xs text-muted font-mono">{title}</span>
        </div>
      )}
      <div className="relative">
        <pre
          className={`language-${language} ${title ? "!rounded-t-none !border-t-0" : ""}`}
        >
          <code ref={codeRef} className={`language-${language}`}>
            {code}
          </code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 px-2 py-1 rounded text-xs text-muted hover:text-foreground bg-surface hover:bg-surface-hover border border-border opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
