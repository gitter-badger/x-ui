import { EventEmitter } from './event-emitter';

const bus = new EventEmitter();

export { bus as ActionBus };
