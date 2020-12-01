import { LoggingService } from './logging.service';
import { state, onChange } from './state.service';

export * from './data';

const logger = new LoggingService();

export {
  state,
  onChange,
  logger,
};
