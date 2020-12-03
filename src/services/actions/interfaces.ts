export interface IActionEventListener {
  initialize(win: Window): void;
  destroy(): void;
}

export enum ActionActivationStrategy {
  onElementEvent,
  onUIEvent,
  onEnter,
  onExit,
  onTime,
}
