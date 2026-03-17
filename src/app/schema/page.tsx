import { schemaFields, type SchemaField } from "@/lib/schema";

function FieldRow({
  field,
  depth = 0,
}: {
  field: SchemaField;
  depth?: number;
}) {
  return (
    <>
      <tr className="border-b border-border hover:bg-surface-hover/50 transition-colors">
        <td className="px-4 py-3 font-mono text-sm">
          <span style={{ paddingLeft: `${depth * 20}px` }}>
            {depth > 0 && (
              <span className="text-border mr-1.5">└</span>
            )}
            <span className="text-accent">{field.name}</span>
          </span>
        </td>
        <td className="px-4 py-3 font-mono text-xs text-muted">
          {field.type}
        </td>
        <td className="px-4 py-3 text-center">
          {field.required ? (
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
              required
            </span>
          ) : (
            <span className="text-xs text-muted">optional</span>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-muted">{field.description}</td>
      </tr>
      {field.children?.map((child) => (
        <FieldRow key={child.name} field={child} depth={depth + 1} />
      ))}
    </>
  );
}

export default function SchemaPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-4">Schema Reference</h1>
        <p className="text-muted max-w-2xl leading-relaxed">
          Complete field reference for{" "}
          <code className="font-mono text-sm text-foreground bg-surface px-1.5 py-0.5 rounded border border-border">
            agent.json
          </code>
          . Three fields are required:{" "}
          <code className="font-mono text-xs text-accent">awp_version</code>,{" "}
          <code className="font-mono text-xs text-accent">domain</code>, and{" "}
          <code className="font-mono text-xs text-accent">intent</code>.
          Everything else is optional but recommended for full agent
          interoperability.
        </p>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider w-56">
                  Field
                </th>
                <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider w-48">
                  Type
                </th>
                <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider w-24 text-center">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {schemaFields.map((field) => (
                <FieldRow key={field.name} field={field} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 p-6 rounded-xl border border-border bg-surface">
        <h2 className="text-lg font-semibold mb-3">File location</h2>
        <p className="text-muted text-sm leading-relaxed mb-4">
          The{" "}
          <code className="font-mono text-foreground bg-background px-1.5 py-0.5 rounded border border-border">
            agent.json
          </code>{" "}
          file must be served at the root of your domain with{" "}
          <code className="font-mono text-xs text-foreground">
            Content-Type: application/json
          </code>
          :
        </p>
        <code className="font-mono text-sm text-accent block bg-background px-4 py-3 rounded-lg border border-border">
          https://yourdomain.com/agent.json
        </code>
      </div>

      <div className="mt-6 p-6 rounded-xl border border-border bg-surface">
        <h2 className="text-lg font-semibold mb-3">Validation</h2>
        <p className="text-muted text-sm leading-relaxed">
          Use the{" "}
          <a href="/validate" className="text-accent hover:underline">
            validator
          </a>{" "}
          to check your agent.json against the schema, or download the{" "}
          <a
            href="https://github.com/agentwebprotocol/agent.json"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            JSON Schema
          </a>{" "}
          for local validation.
        </p>
      </div>
    </div>
  );
}
