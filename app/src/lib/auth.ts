const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

export interface DirectusUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  token: string | null;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires: number;
}

export async function directusLogin(
  email: string,
  password: string,
): Promise<AuthTokens> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.errors?.[0]?.message || "Invalid email or password");
  }

  const { data } = await res.json();
  return data;
}

export async function directusRegister(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.errors?.[0]?.message || "Registration failed");
  }
}

export async function directusRefresh(
  refreshToken: string,
): Promise<AuthTokens> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refresh_token: refreshToken,
      mode: "json",
    }),
  });

  if (!res.ok) {
    throw new Error("Session expired");
  }

  const { data } = await res.json();
  return data;
}

export async function directusGetMe(
  accessToken: string,
): Promise<DirectusUser> {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  const { data } = await res.json();
  return data;
}

const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || "";

export async function directusGenerateToken(userId: string): Promise<string> {
  const staticToken = crypto.randomUUID();

  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: JSON.stringify({ token: staticToken }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate API token");
  }

  return staticToken;
}

export async function directusRevokeToken(userId: string): Promise<void> {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: JSON.stringify({ token: null }),
  });

  if (!res.ok) {
    throw new Error("Failed to revoke API token");
  }
}

export async function directusGetUserToken(
  userId: string,
): Promise<string | null> {
  const res = await fetch(`${API_URL}/users/${userId}?fields=token`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });

  if (!res.ok) return null;

  const { data } = await res.json();
  const token = data?.token;
  // Directus returns "**********" for masked tokens via non-admin access
  if (!token || token === "**********") return null;
  return token;
}

export async function directusGetGames(accessToken: string) {
  const me = await directusGetMe(accessToken);
  const userFilter = `&filter[user_created][_eq]=${me.id}`;

  async function fetchCollection(collection: string, fields: string) {
    const res = await fetch(
      `${API_URL}/items/${collection}?fields=${fields}&sort=-date_created${userFilter}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!res.ok) {
      console.error(
        `Failed to fetch ${collection}:`,
        await res.text().catch(() => res.statusText),
      );
      return [];
    }
    const json = await res.json();
    return json.data || [];
  }

  const [crosswords, wordgames, sudoku] = await Promise.all([
    fetchCollection(
      "crosswords",
      "id,status,title,difficulty,words,main_word,branding,user_created,date_created",
    ),
    fetchCollection(
      "wordgames",
      "id,status,title,word,definition,max_attempts,branding,user_created,date_created",
    ),
    fetchCollection(
      "sudoku",
      "id,status,title,difficulty,branding,user_created,date_created",
    ),
  ]);

  return { crosswords, wordgames, sudoku };
}

export async function directusCreateGame(
  collection: string,
  data: Record<string, unknown>,
  accessToken: string,
) {
  const res = await fetch(`${API_URL}/items/${collection}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.errors?.[0]?.message || "Failed to create game");
  }

  const result = await res.json();
  return result.data;
}

export async function directusUpdateGame(
  collection: string,
  id: string,
  data: Record<string, unknown>,
  accessToken: string,
) {
  const res = await fetch(`${API_URL}/items/${collection}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.errors?.[0]?.message || "Failed to update game");
  }

  const result = await res.json();
  return result.data;
}

export async function directusDeleteGame(
  collection: string,
  id: string,
  accessToken: string,
) {
  const res = await fetch(`${API_URL}/items/${collection}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete game");
  }
}

export async function directusGetBranding(accessToken: string) {
  const res = await fetch(
    `${API_URL}/items/branding?fields=*&sort=-date_created`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!res.ok) {
    console.error(
      "Failed to fetch branding:",
      await res.text().catch(() => res.statusText),
    );
    return [];
  }
  const json = await res.json();
  return json.data || [];
}
