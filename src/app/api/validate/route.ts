import { NextRequest, NextResponse } from "next/server";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { agentJsonSchema } from "@/lib/schema";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(agentJsonSchema);

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { valid: false, errors: ["Invalid JSON in request body"], warnings: [] },
      { status: 400 }
    );
  }

  const valid = validate(body);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!valid && validate.errors) {
    for (const err of validate.errors) {
      const path = err.instancePath || "(root)";
      errors.push(`${path}: ${err.message}`);
    }
  }

  if (errors.length === 0) {
    const obj = body as Record<string, unknown>;
    if (!obj.capabilities) warnings.push("Missing recommended field: capabilities");
    if (!obj.auth) warnings.push("Missing recommended field: auth");
    if (!obj.errors) warnings.push("Missing recommended field: errors");
    if (!obj.agent_status) warnings.push("Missing recommended field: agent_status");
    if (!obj.agent_hints) warnings.push("Missing recommended field: agent_hints");
    if (!obj.dependencies) warnings.push("Missing recommended field: dependencies");
    if (!obj.entities) warnings.push("Missing recommended field: entities");
  }

  return NextResponse.json({ valid: errors.length === 0, errors, warnings });
}
