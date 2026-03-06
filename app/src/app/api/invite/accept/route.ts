import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";

/**
 * Accept an invite — validate token, set password, auto-login.
 *
 * POST /api/invite/accept
 * Body: { token, password, firstName?, lastName? }
 */
export async function POST(request: NextRequest) {
  try {
    const { token, password, firstName, lastName } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Find invite
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.inviteToken, token))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid invite link" },
        { status: 404 },
      );
    }

    // Check expiry
    if (user.inviteExpiresAt && new Date(user.inviteExpiresAt) < new Date()) {
      return NextResponse.json(
        {
          error:
            "This invite link has expired. Please ask your admin to send a new one.",
        },
        { status: 410 },
      );
    }

    // Hash password and activate the user
    const passwordHash = await bcrypt.hash(password, 12);

    await db
      .update(users)
      .set({
        passwordHash,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        inviteToken: null,
        inviteExpiresAt: null,
      })
      .where(eq(users.id, user.id));

    // Auto-login
    try {
      await signIn("credentials", {
        email: user.email,
        password,
        redirect: false,
      });
    } catch (error) {
      // NextAuth v5 throws NEXT_REDIRECT on success — that's expected
      if (
        error instanceof Error &&
        "digest" in error &&
        typeof (error as Record<string, unknown>).digest === "string" &&
        ((error as Record<string, unknown>).digest as string).includes(
          "NEXT_REDIRECT",
        )
      ) {
        return NextResponse.json({ success: true });
      }
      // Auto-login failed but account is activated — user can login manually
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to accept invite" },
      { status: 500 },
    );
  }
}
