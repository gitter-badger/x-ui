import { IDataProvider } from '../types/interfaces';
import { state } from '.'

export class SessionProvider implements IDataProvider {

  constructor() {
    if(sessionStorage == undefined)
    state.logger.warn('sessionStorage is not available')
  }

  async get(key: string): Promise<string|null> {
    return sessionStorage?.getItem(key) || null;
  }

  async set(key: string, value: any) {
    sessionStorage?.setItem(key,value);
  }
}


