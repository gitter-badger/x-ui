export class StorageProvider {

  async get(key: string) {
    return localStorage.getItem(key);
  }

  async set(key: string, value: string) {
    localStorage.setItem(key, value);
  }
}
