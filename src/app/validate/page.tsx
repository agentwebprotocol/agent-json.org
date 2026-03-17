"use client";

import { useState, useCallback } from "react";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { agentJsonSchema } from "@/lib/schema";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(agentJsonSchema);

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const placeholder = `{
  "awp_version": "0.1",
  "domain": "example.com",
  "intent": "Describe what your service does...",
  "actions": []
}`;

export default function ValidatePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = useCallback(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(input);
    } catch (e) {
      setResult({
        valid: false,
        errors: [
          `Invalid JSON: ${e instanceof Error ? e.message : "Parse error"}`,
        ],
        warnings: [],
      });
      return;
    }

    const valid = validate(parsed);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!valid && validate.errors) {
      for (const err of validate.errors) {
        const path = err.instancePath || "(root)";
        errors.push(`${path}: ${err.message}`);
      }
    }

    // Warnings for missing recommended fields (per spec §15)
    if (errors.length === 0) {
      const obj = parsed as Record<string, unknown>;
      if (!obj.capabilities)
        warnings.push("Missing recommended field: capabilities");
      if (!obj.auth) warnings.push("Missing recommended field: auth");
      if (!obj.entities) warnings.push("Missing recommended field: entities");
      if (!obj.errors)
        warnings.push("Missing recommended field: errors (SHOULD include recovery for anticipated failures)");
      if (!obj.dependencies)
        warnings.push("Missing recommended field: dependencies");
      if (!obj.agent_hints)
        warnings.push("Missing recommended field: agent_hints");
      if (!obj.agent_status)
        warnings.push("Missing recommended field: agent_status");
    }

    setResult({ valid: errors.length === 0, errors, warnings });
  }, [input]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-4">Validate</h1>
        <p className="text-muted max-w-2xl leading-relaxed">
          Paste your{" "}
          <code className="font-mono text-sm text-foreground bg-surface px-1.5 py-0.5 rounded border border-border">
            agent.json
          </code>{" "}
          below for instant client-side validation against the AWP schema.
          Nothing is sent to a server.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium">Input</label>
            <button
              onClick={() => {
                setInput("");
                setResult(null);
              }}
              className="text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            spellCheck={false}
            className="w-full h-[500px] bg-[#0c0c12] border border-border rounded-xl p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:border-accent/50 transition-colors placeholder:text-muted/40"
          />
          <button
            onClick={handleValidate}
            className="mt-4 px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors w-full cursor-pointer"
          >
            Validate
          </button>
        </div>

        {/* Results */}
        <div>
          <div className="mb-3">
            <label className="text-sm font-medium">Results</label>
          </div>

          {result === null ? (
            <div className="h-[500px] border border-border rounded-xl bg-surface flex items-center justify-center">
              <p className="text-muted text-sm">
                Paste your agent.json and click Validate
              </p>
            </div>
          ) : (
            <div className="h-[500px] border border-border rounded-xl bg-surface overflow-y-auto">
              {/* Status banner */}
              <div
                className={`px-4 py-3 border-b border-border flex items-center gap-2 ${
                  result.valid ? "bg-success/5" : "bg-error/5"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${result.valid ? "bg-success" : "bg-error"}`}
                />
                <span
                  className={`text-sm font-medium ${result.valid ? "text-success" : "text-error"}`}
                >
                  {result.valid ? "Valid agent.json" : "Validation failed"}
                </span>
              </div>

              <div className="p-4 space-y-3">
                {/* Errors */}
                {result.errors.map((error, i) => (
                  <div
                    key={i}
                    className="flex gap-2 text-sm p-3 rounded-lg bg-error/5 border border-error/10"
                  >
                    <span className="text-error shrink-0 font-mono text-xs mt-0.5">
                      ERR
                    </span>
                    <span className="text-error/90 font-mono text-xs">
                      {error}
                    </span>
                  </div>
                ))}

                {/* Warnings */}
                {result.warnings.map((warning, i) => (
                  <div
                    key={i}
                    className="flex gap-2 text-sm p-3 rounded-lg bg-warning/5 border border-warning/10"
                  >
                    <span className="text-warning shrink-0 font-mono text-xs mt-0.5">
                      WARN
                    </span>
                    <span className="text-warning/90 font-mono text-xs">
                      {warning}
                    </span>
                  </div>
                ))}

                {result.valid && result.warnings.length === 0 && (
                  <p className="text-success/80 text-sm">
                    All fields present and valid. Your agent.json is ready to
                    deploy.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
