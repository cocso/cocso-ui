interface CacheItem<T> {
  expiresAt: number;
  value: T;
}

/** In-memory cache with per-entry time-to-live expiration. */
export class TtlCache {
  private readonly cache = new Map<string, CacheItem<unknown>>();

  /** Returns the cached value for `key`, or `undefined` if missing or expired. */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) {
      return undefined;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value as T;
  }

  /** Stores `value` under `key` with a TTL of `ttlMs` milliseconds. */
  set<T>(key: string, value: T, ttlMs: number): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }
}
