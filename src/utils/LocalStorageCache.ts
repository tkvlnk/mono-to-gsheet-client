
export class LocalStorageCache<Data> {
  constructor(
    private storageKey: string,
    private cacheLifespan = 1000 * 60 * 60 * 24,
  ) {}

  private isExpired(cacheTimestamp: number) {
    const now = Date.now();
    const cacheAge = now - cacheTimestamp;

    return cacheAge < this.cacheLifespan;
  }

  get() {
    const cache = localStorage.getItem(this.storageKey);

    if (!cache) {
      return null;
    }

    const {timestamp, ...data} = JSON.parse(cache) as Data & {timestamp: number};

    if (!this.isExpired(timestamp)) {
      return null;
    }

    return data;
  }

  set(data: Data) {
    localStorage.setItem(this.storageKey, JSON.stringify({
      timestamp: Date.now(),
      ...data
    }));
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }
}
