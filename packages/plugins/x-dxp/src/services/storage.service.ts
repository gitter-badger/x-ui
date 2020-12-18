
const ExperienceKey = 'experience-key';
const ExperienceDataKey = 'experience-data';

export class StorageService {

  constructor(
    private prefix = 'dxp:',
    private storage: Storage = window.localStorage
    )
  {
  }

  public get experienceData(): string {
    return this.get(ExperienceDataKey);
  }
  public set experienceData(data: string) {
    this.set(ExperienceDataKey, data);
  }

  public get xid(): string {
    return this.get(ExperienceKey);
  }
  public set xid(value: string) {
    this.set(ExperienceKey, value);
  }


  public set(key: string, val: string): void {
    this.storage.setItem(`${this.prefix}:${key}`, val);
  }

  public remove(key: string): void {
    this.storage.removeItem(`${this.prefix}:${key}`);
  }

  public get(key: string): string {
    return this.storage.getItem(`${this.prefix}:${key}`);
  }

  public clear() : void {
    this.storage.clear();
  }

}
