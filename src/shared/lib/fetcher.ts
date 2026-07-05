export async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // 세션 만료 → 재로그인 유도 (브라우저에서만)
    if (response.status === 401 && typeof window !== 'undefined') {
      const redirectTo = encodeURIComponent(window.location.pathname);
      window.location.href = `/login?redirectTo=${redirectTo}`;
    }

    let message = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body?.message) {
        message = body.message;
      }
    } catch {
      // 본문이 JSON이 아닌 경우 기본 메시지 유지
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  return parseJsonResponse<T>(response);
}
