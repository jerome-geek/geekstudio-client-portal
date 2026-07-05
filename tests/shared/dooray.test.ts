import { afterEach, describe, expect, it, vi } from 'vitest';
import { DoorayApiError, doorayRequest, doorayUploadFile } from '@/shared/lib/dooray';

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });
}

const okEnvelope = {
  header: { isSuccessful: true, resultCode: 0, resultMessage: '' },
  result: { id: '1' }
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('doorayRequest', () => {
  it('adds the Dooray token header and unwraps the envelope', async () => {
    vi.stubEnv('DOORAY_BASE_URL', 'https://api.example.com');
    vi.stubEnv('DOORAY_API_TOKEN', 'secret-token');

    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(okEnvelope));
    vi.stubGlobal('fetch', fetchMock);

    const { result } = await doorayRequest<{ id: string }>('/project/v1/projects/1/posts');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/project/v1/projects/1/posts',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'dooray-api secret-token'
        })
      })
    );
    expect(result.id).toBe('1');
  });

  it('throws DoorayApiError when the envelope reports failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          header: { isSuccessful: false, resultCode: -1, resultMessage: 'no permission' },
          result: null
        })
      )
    );

    await expect(doorayRequest('/project/v1/projects/1/posts')).rejects.toThrowError(
      DoorayApiError
    );
  });
});

describe('doorayUploadFile', () => {
  it('follows the 307 redirect while keeping the Authorization header', async () => {
    vi.stubEnv('DOORAY_API_TOKEN', 'secret-token');

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, {
          status: 307,
          headers: { location: 'https://file-api.example.com/uploads/x' }
        })
      )
      .mockResolvedValueOnce(jsonResponse(okEnvelope));
    vi.stubGlobal('fetch', fetchMock);

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const { result } = await doorayUploadFile<{ id: string }>('/x', file);

    expect(result.id).toBe('1');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe('https://file-api.example.com/uploads/x');
    expect(fetchMock.mock.calls[1][1].headers).toMatchObject({
      Authorization: 'dooray-api secret-token'
    });
  });
});
