import { EventEmitter } from './event-emitter';

export interface IActionEventListener {
  initialize(bus: EventEmitter): void;
  destroy(): void;
}

export enum ActionActivationStrategy {
  OnEvent = 'OnEvent',
  OnElementEvent = 'OnElementEvent',
  OnEnter = 'OnEnter',
  OnExit = 'OnExit',
  AtTime = 'AtTime',
}
