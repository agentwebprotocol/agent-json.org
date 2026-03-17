import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    operational: true,
    degraded_actions: [],
    timestamp: new Date().toISOString(),
  });
}
