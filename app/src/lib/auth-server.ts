import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  directusRefresh,
  directusGetMe,
  directusGetUserToken,
  type DirectusUser,
} from "./auth";

/**
 * Get a valid access token from cookies, auto-refreshing if needed.
 * Returns null if no valid session exists.
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (accessToken) return accessToken;

  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) return null;

  try {
    const tokens = await directusRefresh(refreshToken);
    // Note: We can't set cookies in a Server Component, but the middleware
    // handles the redirect for unauthenticated users. The refreshed token
    // is still usable for this request.
    return tokens.access_token;
  } catch {
    return null;
  }
}

/**
 * Get the authenticated user, redirecting to login if not authenticated.
 */
export async function getAuthenticatedUser(): Promise<DirectusUser> {
  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login");

  try {
    return await directusGetMe(accessToken);
  } catch {
    redirect("/login");
  }
}

/**
 * Get the authenticated user along with their static API token.
 */
export async function getAuthenticatedUserWithToken(): Promise<{
  user: DirectusUser;
  token: string | null;
}> {
  const user = await getAuthenticatedUser();
  const token = await directusGetUserToken(user.id);
  return { user, token };
}
