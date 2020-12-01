import { LoggingService } from './logging-service';
import { state, onChange } from './state-service';

export * from './data';
export * from './actions';

const logger = new LoggingService();

export {
  state,
  onChange,
  logger,
};
