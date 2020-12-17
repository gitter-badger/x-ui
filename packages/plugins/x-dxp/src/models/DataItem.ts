import { DataType } from './DataType'

export class DataItem {
  constructor(dataPoint: any, value: any) {
    if (dataPoint) {
      this.key = dataPoint.key
      this.type = dataPoint.type
      this.value = value
    }
  }

  /**
   * Data key
   * @pattern ^[A-Za-z0-9-_]{1,30}$
   */
  public key: string

  /** Data type */
  public type: DataType

  /**
   * Data value
   * @nullable
   */
  public value?: any
}
