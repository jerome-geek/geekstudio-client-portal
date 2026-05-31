type FetchLike = typeof fetch;

export function createDoorayClient({
  baseUrl,
  token,
  fetcher = fetch
}: {
  baseUrl: string;
  token: string;
  fetcher?: FetchLike;
}) {
  const request = async (path: string, init?: RequestInit) =>
    fetcher(`${baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `dooray-api ${token}`,
        ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(init?.headers ?? {})
      }
    });

  return {
    get: (path: string) => request(path),
    post: (path: string, body: unknown) =>
      request(path, {
        method: 'POST',
        body: JSON.stringify(body)
      }),
    put: (path: string, body: unknown) =>
      request(path, {
        method: 'PUT',
        body: JSON.stringify(body)
      }),
    patch: (path: string, body: unknown) =>
      request(path, {
        method: 'PATCH',
        body: JSON.stringify(body)
      }),
    postForm: (path: string, body: FormData) =>
      request(path, {
        method: 'POST',
        body
      })
  };
}

export function getDoorayClient() {
  return createDoorayClient({
    baseUrl: process.env.DOORAY_BASE_URL ?? '',
    token: process.env.DOORAY_API_TOKEN ?? ''
  });
}
