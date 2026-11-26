import { describe, it, expect, beforeEach, vi } from 'vitest';

function createLocalStorageMock() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    key: (i) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size;
    }
  };
}

describe('Storage compatibility API', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createLocalStorageMock());
  });

  it('exposes getCompletedLessons and saveLessonProgress returning all saved lessons', async () => {
    const { Storage } = await import('./storage');
    expect(Storage.getCompletedLessons()).toEqual({});

    const updated = Storage.saveLessonProgress('c1-l1', {
      netWpm: 38,
      grossWpm: 40,
      accuracy: 98,
      passed: true,
      targetWpm: 20,
      timeSeconds: 45
    });

    expect(updated['c1-l1']).toBeDefined();
    expect(updated['c1-l1'].netWpm).toBe(38);
    expect(Storage.getCompletedLessons()['c1-l1'].stars).toBe(3);
  });

  it('exposes exportBackupJSON for Account backup download', async () => {
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    const click = vi.fn();
    const remove = vi.fn();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
    vi.stubGlobal('document', {
      createElement: () => ({ click, remove, href: '', download: '' }),
      body: { appendChild: vi.fn() }
    });

    const { Storage } = await import('./storage');
    Storage.exportBackupJSON();
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');
  });
});
