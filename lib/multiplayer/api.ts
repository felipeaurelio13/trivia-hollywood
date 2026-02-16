const rawMultiplayerApiBaseUrl = process.env.NEXT_PUBLIC_MULTIPLAYER_API_BASE_URL ?? '';

function normalizeApiBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, '');
}

export const multiplayerApiBaseUrl = normalizeApiBaseUrl(rawMultiplayerApiBaseUrl);

export const hasExternalMultiplayerApi = multiplayerApiBaseUrl.length > 0;

export function buildMultiplayerApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!hasExternalMultiplayerApi) {
    return normalizedPath;
  }

  return `${multiplayerApiBaseUrl}${normalizedPath}`;
}

