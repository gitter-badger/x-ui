

export interface IValueProvider {
  get(key: string): Promise<string>;
  set(key: string, value: string): Promise<void>;
}
