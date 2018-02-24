// TODO: move it to const dependency?
const LRU_ITEMS = 10;

export class LruList {

  constructor(private prefix: string) { }

  public addToLruList(key: string, value: string | number) {
    const items = this.fetchLruList();
    const found = items.find((i) => i.k === key);
    if (found) {
      const idx = items.indexOf(found);
      items.splice(idx, 1);
    }
    items.push({ k: key, v: value });
    // Save last N items
    window.localStorage.setItem(this.prefix, JSON.stringify(items.slice(-LRU_ITEMS)));
  }

  public getFromLruList(key: string) {
    const items = this.fetchLruList();
    const found = items.find((i) => i.k === key);
    if (found) {
      return found.v;
    } else {
      return null;
    }
  }

  public removeFromLruList(key: string) {
    const items = this.fetchLruList();
    const found = items.find((i) => i.k === key);
    if (found) {
      const idx = items.indexOf(found);
      items.splice(idx, 1);
    }
    // Save last N items
    window.localStorage.setItem(this.prefix, JSON.stringify(items.slice(-LRU_ITEMS)));
  }

  private fetchLruList(): any[] {
    try {
      const lruContent = window.localStorage.getItem(this.prefix);
      if (lruContent) {
        return JSON.parse(lruContent);
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
