import { LoggingService } from './logging.service';
import { state, onChange } from './state.service';

const logger = new LoggingService();

export {
  state,
  onChange,
  logger,
};
