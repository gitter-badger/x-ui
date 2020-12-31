export const AUDIO_TOPIC ='audio';

export enum AUDIO_COMMANDS {
  Play = 'play',
  Queue = 'queue',
  Load = 'load',
  Start = 'start',
  Pause = 'pause',
  Resume = 'resume',
  Mute = 'mute',
  Volume = 'volume',
  Seek = 'seek',
}

export enum AUDIO_EVENTS {
  Played = 'played',
  Queued = 'queued',
  Loaded = 'loaded',
  Started = 'started',
  Paused = 'paused',
  Resumed = 'resumed',
  Stopped = 'stopped',
  Muted = 'muted',
  Ended = 'ended'
}

export enum DiscardStrategy {
  Route = 'route',
  Next = 'next',
  None = 'none'
}

export enum LoadStrategy {
  Queue = 'queue',
  Play = 'play',
  Load = 'load',
}

export enum AudioType {
  Sound = 'sound',
  Music = 'music'
}

export class AudioTrack {
  trackId:string;
  type: AudioType;
  src:string;
  mode: LoadStrategy;
  discard: DiscardStrategy;
  track: boolean;
  loop: boolean;
}


export class AudioRequest {
  trackId: string;
  type: AudioType;
  value: any;
}
