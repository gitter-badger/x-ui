export interface IActionEventListener {
  initialize(win: Window): void;
  destroy(): void;
}

export enum ActionActivationStrategy {
  onEvent,
  onVisible,
  onEnter,
  onExit,
  onTime,
}
