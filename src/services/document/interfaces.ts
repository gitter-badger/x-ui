export interface IDocumentProvider {
  alert(message: string): Promise<void>;
}

export const DOCUMENT_TOPIC = 'xui:action-events:document';

export enum DOCUMENT_COMMANDS {
  RegisterProvider = 'register-provider',
  Alert = 'alert'
}

export type DocumentProviderRegistration = {
  name: string;
  provider: IDocumentProvider
};
