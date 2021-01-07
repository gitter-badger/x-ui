import { AudioType, LoadStrategy, DiscardStrategy } from './interfaces';

export class AudioInfo {
  trackId: string;
  type: AudioType;
  src: string;
  mode: LoadStrategy;
  discard: DiscardStrategy;
  track: boolean;
  loop: boolean;
}
