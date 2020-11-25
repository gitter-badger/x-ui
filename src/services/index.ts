
import { LoggingService } from './logging.service';
import { ValueProviderFactory } from './value.provider';
import { state, onChange } from './state.service';

const valueProviderFactory = new ValueProviderFactory();
const logger = new LoggingService();
const session = valueProviderFactory.getProvider('session');

export {
  logger,
  state,
  valueProviderFactory,
  onChange,
  session
 }
