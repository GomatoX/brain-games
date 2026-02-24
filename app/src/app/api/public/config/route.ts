import { NextResponse } from "next/server";
import { platformConfig } from "@/lib/platform";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

/**
 * Public config endpoint for the game player.
 * Returns platform name, accent color, and logo.
 * GET /api/public/config
 */
export async function GET() {
  return NextResponse.json(
    {
      name: platformConfig.name,
      accent: platformConfig.accent,
      logo: platformConfig.logo,
    },
    { headers: corsHeaders },
  );
}
