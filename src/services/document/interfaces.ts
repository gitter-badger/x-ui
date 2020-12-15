export interface IDocumentProvider {
  alert(message: string): Promise<void>;
}

export const DOCUMENT_TOPIC = 'xui:action-events:document';

export enum DOCUMENT_COMMANDS {
  RegisterProvider = 'register-provider'
}

export type DocumentProviderRegistration = {
  name: string;
  provider: IDocumentProvider
};
