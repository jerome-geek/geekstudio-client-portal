import 'server-only';

export interface DoorayEnvelope<T> {
  header: {
    isSuccessful: boolean;
    resultCode: number;
    resultMessage: string;
  };
  result: T;
  totalCount?: number;
}

export class DoorayApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'DoorayApiError';
  }
}

function authHeaders() {
  return { Authorization: `dooray-api ${process.env.DOORAY_API_TOKEN ?? ''}` };
}

function baseUrl() {
  return process.env.DOORAY_BASE_URL ?? 'https://api.dooray.com';
}

async function toEnvelope<T>(response: Response): Promise<DoorayEnvelope<T>> {
  let json: DoorayEnvelope<T> | null = null;
  try {
    json = (await response.json()) as DoorayEnvelope<T>;
  } catch {
    // 비정상 응답 본문
  }

  if (!response.ok || json?.header?.isSuccessful === false) {
    throw new DoorayApiError(
      json?.header?.resultMessage || `Dooray API request failed (${response.status})`,
      response.ok ? 502 : response.status
    );
  }

  if (!json) {
    throw new DoorayApiError('Dooray API returned an invalid response', 502);
  }

  return json;
}

export async function doorayRequest<T>(
  path: string,
  init?: { method?: string; body?: unknown }
): Promise<DoorayEnvelope<T>> {
  const response = await fetch(`${baseUrl()}${path}`, {
    method: init?.method ?? 'GET',
    headers: {
      ...authHeaders(),
      ...(init?.body !== undefined ? { 'Content-Type': 'application/json' } : {})
    },
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: 'no-store'
  });

  return toEnvelope<T>(response);
}

// 파일 업/다운로드는 file-api.dooray.com 으로 307 리다이렉트되며,
// fetch 는 크로스 호스트 리다이렉트에서 Authorization 헤더를 제거하므로 수동으로 따라간다.
async function followFileRedirect(
  path: string,
  method: string,
  makeBody?: () => BodyInit
): Promise<Response> {
  const first = await fetch(`${baseUrl()}${path}`, {
    method,
    headers: authHeaders(),
    redirect: 'manual',
    body: makeBody?.(),
    cache: 'no-store'
  });

  if (first.status === 307) {
    const location = first.headers.get('location');
    if (!location) {
      throw new DoorayApiError('Dooray file API redirect is missing a location header', 502);
    }
    return fetch(location, { method, headers: authHeaders(), body: makeBody?.() });
  }

  return first;
}

export async function doorayUploadFile<T>(path: string, file: File): Promise<DoorayEnvelope<T>> {
  const response = await followFileRedirect(path, 'POST', () => {
    const form = new FormData();
    form.append('file', file, file.name);
    return form;
  });

  return toEnvelope<T>(response);
}

export async function doorayDownloadFile(path: string): Promise<Response> {
  const response = await followFileRedirect(path, 'GET');

  if (!response.ok) {
    throw new DoorayApiError(`Dooray file download failed (${response.status})`, response.status);
  }

  return response;
}
