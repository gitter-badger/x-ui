export interface IActionEventListener {
  initialize(win: Window): void;
  destroy(): void;
}
