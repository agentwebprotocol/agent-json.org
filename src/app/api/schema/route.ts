import { NextResponse } from "next/server";
import { agentJsonSchema } from "@/lib/schema";

export async function GET() {
  return NextResponse.json({
    schema: agentJsonSchema,
    version: "0.1",
  });
}
