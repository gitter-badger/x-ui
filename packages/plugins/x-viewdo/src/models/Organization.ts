export class Organization {
  public key: string;
  public name: string;
  public childEntityType?: string;
  public entities: any[] = [];
  public dataPoints?: any;
  public data: {
    [key: string]: string | number | Date | boolean;
  } = {};
  public logoUrl: string
}
