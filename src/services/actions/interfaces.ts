import { LoggingService } from '../logging-service';

export interface IActionEventListener {
  initialize(win: Window, logger: LoggingService): void;
  destroy(): void;
}
