import { ActionEvent, IActionEventListener } from '../actions';
import { DOCUMENT_TOPIC, DOCUMENT_COMMANDS, IDocumentProvider } from './interfaces';
import { setProvider } from './provider-factory';

export class DocumentListener implements IActionEventListener {
  document: HTMLDocument;
  eventOptions: EventListenerOptions = { capture: false };

  initialize(win: Window): void {
    this.document = win.document;
    this.listen();
  }

  listen() {
    this.document.addEventListener(
      DOCUMENT_TOPIC,
      this.handleEvent,
      this.eventOptions);
  }

  handleEvent(ev: CustomEvent<ActionEvent<any>>) {
    const actionEvent = ev.detail;
    if (actionEvent.command === DOCUMENT_COMMANDS.RegisterProvider) {
      const { name, provider } = actionEvent.data;
      if (name && provider) {
        this.registerProvider(name, provider);
      }
    }
  }

  registerProvider(name: string, provider: IDocumentProvider) {
    setProvider(name, provider as IDocumentProvider);
  }

  destroy(): void {
    this.document.removeEventListener(
      DOCUMENT_TOPIC,
      this.handleEvent,
      this.eventOptions);
  }
}
