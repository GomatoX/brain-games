import { NextRequest, NextResponse } from "next/server";
import { signIn, signOut, auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  try {
    switch (action) {
      case "login": {
        const result = await signIn("credentials", {
          email: body.email,
          password: body.password,
          redirect: false,
        });

        if (result?.error) {
          return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 400 },
          );
        }

        return NextResponse.json({ success: true });
      }

      case "register": {
        // Registration is handled by /api/register route
        // This is kept for backwards compatibility
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
        await signIn("credentials", {
          email: body.email,
          password: body.password,
          redirect: false,
        });

        return NextResponse.json({ success: true });
      }

      case "logout": {
        await signOut({ redirect: false });
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
