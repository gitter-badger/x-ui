import { EventEmitter } from './event-emitter';

export interface IActionEventListener {
  initialize(bus: EventEmitter): void;
  destroy(): void;
}

export enum ActionActivationStrategy {
  OnEnter = 'OnEnter',
  OnExit = 'OnExit',
  AtTime = 'AtTime',
  OnElementEvent = 'OnElementEvent',
}
