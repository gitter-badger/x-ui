import { UrlService } from './url.service';
import { StorageService } from './storage.service';
import { SessionService } from './session.service';
import { LoggingService } from './logging.service';
import { state, onChange } from './state.service';

const urlService = new UrlService();
const storageService = new StorageService();
const sessionService = new SessionService();
const logger = new LoggingService();

export {
  urlService,
  state, onChange,
  storageService,
  sessionService,
  logger,
}
