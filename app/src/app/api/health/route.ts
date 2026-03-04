import { NextResponse } from "next/server";

/**
 * Health check endpoint for k8s liveness/readiness probes.
 * GET /api/health
 */
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
