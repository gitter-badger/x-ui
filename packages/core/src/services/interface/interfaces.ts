import { OnChangeHandler } from '@stencil/store/dist/types';

export class InterfaceState {
  theme: 'light' | 'dark' | string;
  muted: boolean;
  autoplay: boolean;
  hasAudio: boolean;
}

export type InterfaceProvider = {
  setTheme(theme: 'dark'| 'light'): void;
  setAutoPlay(autoPlay: boolean): void;
  setSound(muted: boolean): void;
  onChange: OnChangeHandler<InterfaceState>
};

export const INTERFACE_TOPIC = 'interface';

export enum INTERFACE_COMMANDS {
  RegisterProvider = 'register-provider',
  Alert = 'alert',
  OpenToast = 'open-toast',
  ModalOpen = 'modal-open',
  ModalClose = 'modal-open',
  OpenPopover = 'open-popover',
  SetTheme = 'set-theme',
  SetAutoPlay = 'set-auto-play',
  SetSound = 'set-sound',
  ElementToggleClass = 'element-toggle-class',
  ElementAddClasses = 'element-add-classes',
  ElementRemoveClasses = 'element-remove-classes',
  ElementSetAttribute = 'element-set-attribute',
  ElementRemoveAttribute = 'element-remove-attribute',
  ElementCallMethod = 'element-call-method'
}

export enum INTERFACE_EVENTS {
  ThemeChanged = 'theme',
  AutoPlayChanged = 'autoplay',
  SoundChanged = 'muted'
}

export type InterfaceProviderRegistration = {
  name: string;
  provider: InterfaceProvider
};


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

export enum DiscardStrategy {
  Route = 'route',
  Video = 'video',
  Next = 'next',
  None = 'none'
}

export enum LoadStrategy {
  Queue = 'queue',
  Play = 'play',
  Load = 'load',
}

export type AudioTrack = {
  id:string;
  type: 'music'|'sound';
  src:string;
  load: LoadStrategy;
  discard: DiscardStrategy;
  track: boolean;
  loop: boolean;
}
