import { getAuthenticatedUser } from "@/lib/auth-server";
import { db } from "@/db";
import { organizations, branding, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import SettingsContent from "@/components/SettingsContent";
import DashboardContainer from "@/components/DashboardContainer";

export default async function SettingsPage() {
  const user = await getAuthenticatedUser();
  const isOwner = user.orgRole === "owner";

  const [org, presets, userRow] = await Promise.all([
    db
      .select({
        language: organizations.defaultLanguage,
        defaultBranding: organizations.defaultBranding,
        name: organizations.name,
        logoUrl: organizations.logoUrl,
        shareImageUrl: organizations.shareImageUrl,
        shareTitle: organizations.shareTitle,
        shareDescription: organizations.shareDescription,
      })
      .from(organizations)
      .where(eq(organizations.id, user.orgId))
      .limit(1)
      .then((rows) => rows[0]),
    db
      .select({ id: branding.id, name: branding.name })
      .from(branding)
      .where(eq(branding.orgId, user.orgId))
      .orderBy(desc(branding.createdAt)),
    db
      .select({ usePlatformChrome: users.usePlatformChrome })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1)
      .then((rows) => rows[0]),
  ]);

  const initialSettings = {
    language: org?.language || "lt",
    default_branding: org?.defaultBranding || "",
    org_name: org?.name || "",
    logo_url: org?.logoUrl || null,
    share_image_url: org?.shareImageUrl || "",
    share_title: org?.shareTitle || "",
    share_description: org?.shareDescription || "",
    use_platform_chrome: userRow?.usePlatformChrome ?? false,
  };

  const initialBrandingOptions = presets.map((b) => ({
    id: b.id,
    name: b.name || `Preset ${b.id}`,
  }));

  return (
    <DashboardContainer>
      <SettingsContent
        isOwner={isOwner}
        initialSettings={initialSettings}
        initialBrandingOptions={initialBrandingOptions}
      />
    </DashboardContainer>
  );
}
