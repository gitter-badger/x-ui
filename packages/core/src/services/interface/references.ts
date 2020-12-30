import { state } from './state';

export function hasReference(url: string) {
  return state.references.includes(url);
}

export function markReference(url: string) {
  state.references = [...new Set([...state.references, url])];
}

export function clearReferences() {
  state.references = [];
}

export interface ISwipeEvent {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}
