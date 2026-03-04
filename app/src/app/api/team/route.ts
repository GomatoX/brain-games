import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, organizations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

/**
 * Team management API (org-scoped).
 *
 * GET    /api/team — list members of the current org
 * POST   /api/team — invite/create a new member (owner only)
 * DELETE /api/team — remove a member (owner only)
 */

async function getOrgContext() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) return null;

  return {
    userId: user.id,
    orgId: user.orgId,
    orgRole: user.orgRole,
  };
}

export async function GET() {
  const ctx = await getOrgContext();
  if (!ctx) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Get org info
    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, ctx.orgId))
      .limit(1);

    // Get all members
    const members = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        orgRole: users.orgRole,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.orgId, ctx.orgId));

    return NextResponse.json({
      org: {
        id: org?.id,
        name: org?.name,
      },
      members: members.map((m) => ({
        id: m.id,
        email: m.email,
        first_name: m.firstName,
        last_name: m.lastName,
        org_role: m.orgRole,
        created_at: m.createdAt,
      })),
      currentUserId: ctx.userId,
      isOwner: ctx.orgRole === "owner",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const ctx = await getOrgContext();
  if (!ctx) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (ctx.orgRole !== "owner") {
    return NextResponse.json(
      { error: "Only the organization owner can invite members" },
      { status: 403 },
    );
  }

  try {
    const { email, firstName, lastName, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [member] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        firstName: firstName || null,
        lastName: lastName || null,
        orgId: ctx.orgId,
        orgRole: "member",
      })
      .returning();

    return NextResponse.json(
      {
        member: {
          id: member.id,
          email: member.email,
          first_name: member.firstName,
          last_name: member.lastName,
          org_role: member.orgRole,
          created_at: member.createdAt,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const ctx = await getOrgContext();
  if (!ctx) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (ctx.orgRole !== "owner") {
    return NextResponse.json(
      { error: "Only the organization owner can remove members" },
      { status: 403 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("id");

    if (!memberId) {
      return NextResponse.json(
        { error: "Member id is required" },
        { status: 400 },
      );
    }

    // Cannot remove yourself
    if (memberId === ctx.userId) {
      return NextResponse.json(
        { error: "Cannot remove yourself" },
        { status: 400 },
      );
    }

    const deleted = await db
      .delete(users)
      .where(and(eq(users.id, memberId), eq(users.orgId, ctx.orgId)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 },
    );
  }
}
