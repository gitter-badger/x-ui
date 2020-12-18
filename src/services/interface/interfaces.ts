import { OnChangeHandler } from '@stencil/store/dist/types';

export class InterfaceState {
  theme: 'light' | 'dark' | string;
  muted: boolean;
  autoplay: boolean;
  hasAudio: boolean;
}

export type InterfaceProvider = {
  alert(message: string): Promise<void>;
  openToast(args: any): Promise<void>;
  modalOpen(args: any): Promise<void>;
  modalClose(args: any): Promise<void>;
  openPopover(args: any): Promise<void>;
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
  ElementRemoveClasses = ' element-remove-classes',
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
