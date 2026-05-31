import { describe, expect, it, vi } from 'vitest';
import { createDoorayClient } from '@/shared/lib/dooray';

describe('createDoorayClient', () => {
  it('adds the Dooray token header to outbound requests', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    const client = createDoorayClient({
      baseUrl: 'https://api.example.com',
      token: 'secret-token',
      fetcher
    });

    await client.get('/projects/1/tasks');

    expect(fetcher).toHaveBeenCalledWith(
      'https://api.example.com/projects/1/tasks',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'dooray-api secret-token'
        })
      })
    );
  });
});
