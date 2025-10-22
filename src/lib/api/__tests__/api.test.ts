import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('api facade', () => {
  it('uses mock adapter when configured', async () => {
    const getTickers = vi.fn().mockResolvedValue([]);
    vi.mock('@/lib/utils/env', () => ({ env: { dataSource: 'mock' } }));
    vi.mock('@/lib/api/adapters/mock', () => ({ mockAdapter: { getTickers } }));
    vi.mock('@/lib/api/adapters/bvcLive', () => ({ bvcLiveAdapter: { getTickers: vi.fn() } }));
    const { api } = await import('@/lib/api');

    await api.getTickers();
    expect(getTickers).toHaveBeenCalled();
  });

  it('uses live adapter when configured', async () => {
    const getTickers = vi.fn().mockResolvedValue([]);
    vi.mock('@/lib/utils/env', () => ({ env: { dataSource: 'bvc' } }));
    vi.mock('@/lib/api/adapters/mock', () => ({ mockAdapter: { getTickers: vi.fn() } }));
    vi.mock('@/lib/api/adapters/bvcLive', () => ({ bvcLiveAdapter: { getTickers } }));
    const { api } = await import('@/lib/api');

    await api.getTickers();
    expect(getTickers).toHaveBeenCalled();
  });
});
