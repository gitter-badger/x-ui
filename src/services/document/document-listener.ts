import { ActionEvent, IActionEventListener } from '../actions';
import { EventEmitter } from '../actions/event-emitter';
import { debugIf } from '../logging';
import { state } from '../state';
import { DOCUMENT_TOPIC, DOCUMENT_COMMANDS, IDocumentProvider } from './interfaces';
import { getDocumentProvider, setDocumentProvider } from './provider-factory';

export class DocumentListener implements IActionEventListener {
  bus: EventEmitter;
  unsubscribe: () => void;
  initialize(bus: EventEmitter): void {
    this.bus = bus;
    this.unsubscribe = this.bus.on(DOCUMENT_TOPIC, (e) => this.handleEvent(e));
  }

  handleEvent(actionEvent: ActionEvent<any>) {
    debugIf(state.debug, `document-listener: action received ${JSON.stringify(actionEvent)}`);

    const currentProvider = getDocumentProvider();
    switch (actionEvent.command) {
      case DOCUMENT_COMMANDS.RegisterProvider: {
        const { name, provider } = actionEvent.data;
        if (name && provider) {
          setDocumentProvider(provider as IDocumentProvider);
        }
        break;
      }
      case DOCUMENT_COMMANDS.Alert: {
        const { message} = actionEvent.data;
        if (message) {
          // eslint-disable-next-line no-alert
          currentProvider?.alert(message);
        }
        break;
      }
      default:
        break;
    }
  }

  destroy(): void {
    this.unsubscribe();
  }
}
