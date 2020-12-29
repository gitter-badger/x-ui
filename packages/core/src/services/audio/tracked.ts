import { audioState } from './state';

export function hasPlayed(url: string) {
  return audioState.tracked.includes(url);
}

export function trackPlayed(url: string) {
  audioState.tracked = [...new Set([...audioState.tracked, url])];
}

export function clearTracked() {
  audioState.tracked = [];
}
