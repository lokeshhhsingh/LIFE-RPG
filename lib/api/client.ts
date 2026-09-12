/**
 * Thin fetch wrapper. Swap NEXT_PUBLIC_API_BASE_URL to point at the real
 * backend once it's live — everything in lib/api/*.ts should route through
 * this so there's exactly one place that knows about base URL/headers.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(body || res.statusText, res.status);
  }

  // Handle empty responses (e.g. 204 No Content on delete)
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}
