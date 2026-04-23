/**
 * API client for game embeds.
 *
 * Produces a small object with the HTTP calls a game engine needs.
 * Centralises Bearer-token construction and error handling so every
 * game uses the same pattern.
 *
 * @param {object} opts
 * @param {string} opts.apiUrl - Base URL of the dashboard/API (no trailing slash).
 * @param {string} [opts.token] - Optional public API token. When present it's
 *   sent as `Authorization: Bearer <token>` on authenticated endpoints.
 */
export function createApiClient({ apiUrl, token } = {}) {
  if (!apiUrl) {
    throw new Error("createApiClient: apiUrl is required");
  }

  const authHeaders = () => (token ? { Authorization: `Bearer ${token}` } : {});

  /**
   * Fetch a single game/puzzle by type and id.
   * GET {apiUrl}/api/public/games?type={type}&id={id}
   *
   * @param {string} type - Game type, e.g. "wordgames" or "crosswords".
   * @param {string} id - Game id or "latest".
   * @returns {Promise<object>} Parsed JSON body.
   * @throws Error with `status` property on non-2xx responses.
   */
  const fetchGame = async (type, id) => {
    const url = `${apiUrl}/api/public/games?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;
    const response = await fetch(url, { headers: { ...authHeaders() } });
    if (!response.ok) {
      const err = new Error(`fetchGame failed: ${response.status} ${response.statusText}`);
      err.status = response.status;
      throw err;
    }
    return response.json();
  };

  /**
   * Fetch the public platform config (no auth required).
   * GET {apiUrl}/api/public/config
   */
  const fetchPublicConfig = async () => {
    const response = await fetch(`${apiUrl}/api/public/config`);
    if (!response.ok) {
      const err = new Error(`fetchPublicConfig failed: ${response.status}`);
      err.status = response.status;
      throw err;
    }
    return response.json();
  };

  return { fetchGame, fetchPublicConfig };
}
