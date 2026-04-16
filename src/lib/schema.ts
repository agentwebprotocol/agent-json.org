// Based on Agent Web Protocol Specification v0.2
// Source: https://github.com/agentwebprotocol/spec/blob/main/SPEC.md

export const agentJsonSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "agent.json",
  description:
    "Machine-readable declaration published at a domain's root that instructs AI agents regarding permissible actions, required inputs, and error recovery procedures. Part of Agent Web Protocol (AWP).",
  type: "object",
  required: ["awp_version", "domain", "intent", "actions"],
  properties: {
    awp_version: {
      type: "string",
      pattern: "^\\d+\\.\\d+$",
      description: 'Spec version conformance using MAJOR.MINOR format (e.g. "0.2")',
    },
    protocols: {
      type: "object",
      additionalProperties: {
        type: "object",
        required: ["version"],
        properties: {
          version: { type: "string", description: "Protocol version supported" },
          endpoint: { type: "string", description: "Protocol endpoint URL" },
        },
        additionalProperties: true,
      },
      description:
        "v0.2: Sibling agent protocols this surface speaks (e.g. a2a, mcp, acp, ap2, x402, skyfire). Keys are protocol identifiers. Agents may route declared actions through a named protocol via the `via` field.",
    },
    domain: {
      type: "string",
      description: "Canonical domain reference",
    },
    intent: {
      type: "string",
      description: "Plain language surface description of what the service does",
    },
    capabilities: {
      type: "object",
      properties: {
        streaming: { type: "boolean", description: "Endpoint streaming response support" },
        batch_actions: { type: "boolean", description: "Concurrent action submission capability" },
        webhooks: { type: "boolean", description: "Asynchronous result delivery via webhook" },
        pagination: {
          type: "string",
          enum: ["cursor", "offset", "page", "none"],
          description: "Pagination style",
        },
        idempotency: { type: "boolean", description: "Idempotency key support" },
      },
      additionalProperties: true,
      description: "Optional feature indicators for agent evaluation",
    },
    auth: {
      type: "object",
      properties: {
        required_for: {
          type: "array",
          items: { type: "string" },
          description: "Action IDs demanding authentication",
        },
        optional_for: {
          type: "array",
          items: { type: "string" },
          description: "Action IDs where authentication is discretionary",
        },
        type: {
          type: "string",
          enum: ["oauth2", "api_key", "bearer", "none"],
          description: "Authentication category",
        },
        token_expiry: {
          type: "string",
          description: 'Lifespan notation (e.g. "24h", "7d")',
        },
        refresh_endpoint: {
          type: "string",
          description: "Token renewal endpoint",
        },
      },
      description: "Authentication obligations",
    },
    entities: {
      type: "object",
      additionalProperties: {
        type: "object",
        properties: {
          fields: {
            type: "object",
            additionalProperties: { type: "string" },
          },
        },
      },
      description: "Named, schema-defined models referenced by actions",
    },
    actions: {
      type: "array",
      items: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string", description: "Unique action identifier" },
          description: { type: "string", description: "Plain language for agent reasoning" },
          auth_required: { type: "boolean", description: "Authentication necessity" },
          inputs: { type: "object", description: "Typed parameters" },
          outputs: { type: "object", description: "Typed results" },
          endpoint: { type: "string", description: "API path (required unless `via` is set — v0.2)" },
          method: {
            type: "string",
            enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            description: "HTTP verb (required unless `via` is set — v0.2)",
          },
          via: {
            type: "string",
            description:
              "v0.2: Protocol identifier (must appear in top-level `protocols`). When set, the action is invoked via that protocol instead of direct HTTP.",
          },
          operation: {
            type: "string",
            description:
              "v0.2: Protocol-specific operation name when `via` is set (e.g. MCP tool name or A2A method).",
          },
          rate_limit: { type: "string", description: "Throttle specification" },
          idempotency: {
            type: "object",
            properties: {
              supported: { type: "boolean" },
              key_field: { type: "string" },
              window: { type: "string" },
            },
            description: "Idempotency contract",
          },
          execution_model: {
            type: "string",
            enum: ["sync", "async"],
            description: "sync (default) or async",
          },
          poll_endpoint: { type: "string", description: "Job status check URL (async)" },
          sensitivity: {
            type: "string",
            enum: ["standard", "destructive", "irreversible"],
            description: "Operation sensitivity level",
          },
          requires_human_confirmation: {
            type: "boolean",
            description: "Agent SHOULD prompt user before executing",
          },
          reversible: { type: "boolean", description: "Undo capability" },
        },
      },
      description: "Declared executable operations",
    },
    errors: {
      type: "object",
      additionalProperties: {
        type: "object",
        required: ["recovery"],
        properties: {
          recovery: {
            type: "string",
            description: "Executable remediation guidance",
          },
        },
      },
      description: "Error identifiers mapped to remediation pathways",
    },
    dependencies: {
      type: "object",
      additionalProperties: {
        type: "array",
        items: { type: "string" },
      },
      description: "Prerequisite relationships between actions",
    },
    agent_hints: {
      type: "object",
      additionalProperties: { type: "string" },
      description: "Semantic guidance enhancing planning decisions",
    },
    agent_status: {
      type: "object",
      properties: {
        operational: { type: "boolean", description: "Service availability" },
        degraded_actions: {
          type: "array",
          items: { type: "string" },
          description: "Impaired action identifiers",
        },
        status_endpoint: { type: "string", description: "Real-time status location" },
      },
      description: "Operational state signal",
    },
    source: { type: "string", description: "For synthetic files: 'synthetic'" },
    generated_by: { type: "string", description: "For synthetic files: generator identity" },
    confidence: { type: "number", description: "For synthetic files: confidence score 0-1" },
    last_verified: { type: "string", description: "For synthetic files: ISO 8601 verification time" },
  },
  additionalProperties: true,
};

export interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  description: string;
  children?: SchemaField[];
}

export const schemaFields: SchemaField[] = [
  {
    name: "awp_version",
    type: "string",
    required: true,
    description: 'Spec version conformance using MAJOR.MINOR format (e.g. "0.1").',
  },
  {
    name: "domain",
    type: "string",
    required: true,
    description: "Canonical domain reference. Must match the serving domain.",
  },
  {
    name: "intent",
    type: "string",
    required: true,
    description: "Plain language surface description of what the service does and how agents should interact with it.",
  },
  {
    name: "capabilities",
    type: "object",
    required: false,
    description: "Optional feature indicators for agent evaluation.",
    children: [
      { name: "streaming", type: "boolean", required: false, description: "Endpoint streaming response support." },
      { name: "batch_actions", type: "boolean", required: false, description: "Concurrent action submission capability." },
      { name: "webhooks", type: "boolean", required: false, description: "Asynchronous result delivery via webhook." },
      { name: "pagination", type: '"cursor" | "offset" | "page" | "none"', required: false, description: "Pagination style." },
      { name: "idempotency", type: "boolean", required: false, description: "Idempotency key support." },
    ],
  },
  {
    name: "auth",
    type: "object",
    required: false,
    description: "Specifies authentication obligations.",
    children: [
      { name: "required_for", type: "array[string]", required: false, description: "Action IDs demanding authentication." },
      { name: "optional_for", type: "array[string]", required: false, description: "Action IDs where authentication is discretionary." },
      { name: "type", type: '"oauth2" | "api_key" | "bearer" | "none"', required: false, description: "Authentication category." },
      { name: "token_expiry", type: "string", required: false, description: 'Lifespan notation (e.g. "24h", "7d").' },
      { name: "refresh_endpoint", type: "string", required: false, description: "Token renewal endpoint." },
    ],
  },
  {
    name: "entities",
    type: "object",
    required: false,
    description: "Named, schema-defined models referenced by actions. Entity references in action parameters use object[entity_name] or array[entity_name] notation.",
    children: [
      { name: "{entity_name}.fields", type: "object", required: false, description: "Field name → type mapping. Types: string, integer, float, boolean, ISO8601, url, enum[...], array[type], object[entity]." },
    ],
  },
  {
    name: "actions",
    type: "array",
    required: true,
    description: "Core element — declared executable operations. Each action represents an API endpoint agents can invoke.",
    children: [
      { name: "id", type: "string", required: true, description: "Unique action identifier." },
      { name: "description", type: "string", required: true, description: "Plain language for agent reasoning." },
      { name: "auth_required", type: "boolean", required: true, description: "Authentication necessity." },
      { name: "inputs", type: "object", required: true, description: "Typed parameters — each with type, required, default, options, description." },
      { name: "outputs", type: "object", required: true, description: "Typed results (e.g. \"flights\": \"array[flight]\")." },
      { name: "endpoint", type: "string", required: true, description: "API path." },
      { name: "method", type: '"GET" | "POST" | "PUT" | "DELETE" | "PATCH"', required: true, description: "HTTP verb." },
      { name: "rate_limit", type: "string", required: false, description: 'Throttle specification (e.g. "30/minute").' },
      { name: "idempotency", type: "object", required: false, description: "Idempotency contract with supported, key_field, window." },
      { name: "execution_model", type: '"sync" | "async"', required: false, description: "Execution model. Default: sync." },
      { name: "poll_endpoint", type: "string", required: false, description: "Job status check URL (for async actions)." },
      { name: "sensitivity", type: '"standard" | "destructive" | "irreversible"', required: false, description: "Operation sensitivity level." },
      { name: "requires_human_confirmation", type: "boolean", required: false, description: "Agent SHOULD prompt user before executing." },
      { name: "reversible", type: "boolean", required: false, description: "Undo capability." },
    ],
  },
  {
    name: "errors",
    type: "object",
    required: false,
    description: "Maps error identifiers to remediation pathways. Recovery guidance must be executable by software.",
  },
  {
    name: "dependencies",
    type: "object",
    required: false,
    description: "Prerequisite relationships. Maps action ID → array of prerequisite action IDs. Agents MUST execute prerequisites before attempting dependent actions.",
  },
  {
    name: "agent_hints",
    type: "object",
    required: false,
    description: "Semantic guidance enhancing planning decisions. Free-form key-value pairs. Agents should incorporate hints but must not treat them as binding.",
  },
  {
    name: "agent_status",
    type: "object",
    required: false,
    description: "Optional operational state signal.",
    children: [
      { name: "operational", type: "boolean", required: false, description: "Service availability." },
      { name: "degraded_actions", type: "array[string]", required: false, description: "Impaired action identifiers." },
      { name: "status_endpoint", type: "string", required: false, description: "Real-time status location." },
    ],
  },
];
