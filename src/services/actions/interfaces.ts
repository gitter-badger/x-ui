export interface IActionEventListener {
  initialize(win: Window): void;
  destroy(): void;
}

export enum ActionActivationStrategy {
  OnEvent = 'OnEvent',
  OnElementEvent = 'OnElementEvent',
  OnEnter = 'OnEnter',
  OnExit = 'OnExit',
  AtTime = 'AtTime',
}
