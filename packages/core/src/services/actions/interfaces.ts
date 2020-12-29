export interface IEventEmitter  {
  on(event: string, listener: Listener): () => void;
  removeListener(event: string, listener: Listener): void;
  removeAllListeners(): void;
  emit(event: string, ...args: any[]): void;
  once(event: string, listener: Listener): () => void;
}

export interface IEventActionListener {
  initialize(bus: IEventEmitter): void;
  destroy(): void;
}

export enum ActionActivationStrategy {
  OnEnter = 'OnEnter',
  OnExit = 'OnExit',
  AtTime = 'AtTime',
  OnElementEvent = 'OnElementEvent',
}

export interface EventAction<T> {
  topic: string;
  command: string;
  data: T;
}

export type Listener = (...args: any[]) => void;

export interface IEvents {
  [event: string]: Listener[]
}


export interface IActionElement {
  getAction(): Promise<EventAction<any>>;
}
