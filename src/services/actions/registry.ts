import { IActionEventListener } from './interfaces';

const listeners:Array<IActionEventListener> = [];

export function addListener(listener:IActionEventListener) {
  listener.initialize(window);
  listeners.push(listener);
}

export function destroyListeners() {
  let listener = listeners.pop();
  while (listener) {
    listener.destroy();
    listener = listeners.pop();
  }
}
