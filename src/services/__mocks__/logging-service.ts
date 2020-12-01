/* eslint-disable @typescript-eslint/no-unused-vars */
export class LoggingService {
  public log(_message: string) {}
  public debug(_message: string) {}
  public warn(_warning: string, ..._params: any[]) {}
  public error(_message: string, _error?: Error) {}
}
