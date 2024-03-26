export class BrowserStorageCache<Data> {
  constructor(
    private storage: Storage,
    private storageKey: string,
    private cacheLifespan = 1000 * 60 * 60 * 24,
  ) {}

  private isExpired(cacheTimestamp: number) {
    const now = Date.now();
    const cacheAge = now - cacheTimestamp;

    return cacheAge < this.cacheLifespan;
  }

  get() {
    const cache = this.storage.getItem(this.storageKey);

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
    this.storage.setItem(
      this.storageKey,
      JSON.stringify({
        timestamp: Date.now(),
        ...data,
      })
    );
  }

  clear() {
    this.storage.removeItem(this.storageKey);
  }
}
