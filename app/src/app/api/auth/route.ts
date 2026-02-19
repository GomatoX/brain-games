import { NextRequest, NextResponse } from "next/server";
import { signIn, signOut, auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  try {
    switch (action) {
      case "login": {
        try {
          await signIn("credentials", {
            email: body.email,
            password: body.password,
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
            // Success — signIn worked, session cookie is set
            return NextResponse.json({ success: true });
          }
          // Actual auth error
          if (error instanceof AuthError) {
            return NextResponse.json(
              { error: "Invalid email or password" },
              { status: 400 },
            );
          }
          throw error;
        }

        return NextResponse.json({ success: true });
      }

      case "register": {
        const res = await fetch(new URL("/api/register", request.url), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: body.email,
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          return NextResponse.json(
            { error: err.error || "Registration failed" },
            { status: 400 },
          );
        }

        // Auto-login after registration
        try {
          await signIn("credentials", {
            email: body.email,
            password: body.password,
            redirect: false,
          });
        } catch (error) {
          // NEXT_REDIRECT = success
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
        }

        return NextResponse.json({ success: true });
      }

      case "logout": {
        try {
          await signOut({ redirect: false });
        } catch (error) {
          // NEXT_REDIRECT on logout is also expected
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
        }
        return NextResponse.json({ success: true });
      }

      case "generate-token": {
        const session = await auth();
        if (!session?.user?.id) {
          return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 },
          );
        }

        const token = crypto.randomUUID();
        await db
          .update(users)
          .set({ apiToken: token })
          .where(eq(users.id, session.user.id));

        return NextResponse.json({ token });
      }

      case "revoke-token": {
        const session = await auth();
        if (!session?.user?.id) {
          return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 },
          );
        }

        await db
          .update(users)
          .set({ apiToken: null })
          .where(eq(users.id, session.user.id));

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role,
        token: user.apiToken,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
