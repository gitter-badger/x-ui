export interface IActionEventListener {
  initialize(win: Window): void;
  destroy(): void;
}

export enum ActionActivationStrategy {
  onEvent,
  onEnter,
  onExit,
  onTime,
}
