
export class SessionProvider {

  async get(key: string) {
    return sessionStorage.getItem(key);
  }

  async set(key: string, value: any) {
    sessionStorage.setItem(key,value);
  }
}


