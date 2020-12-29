import { EventAction, IEventActionListener } from '../actions';
import { EventEmitter } from '../actions/event-emitter';
import { debugIf } from '../logging';
import { state } from './state';
import { INTERFACE_TOPIC, INTERFACE_COMMANDS, InterfaceProvider } from './interfaces';
import { DefaultInterfaceProvider } from './providers/default';
import { getInterfaceProvider, setInterfaceProvider } from './providers/factory';
import { kebabToCamelCase } from '../utils/string-utils';

export class InterfaceListener implements IEventActionListener {
  bus: EventEmitter;
  unsubscribe: () => void;
  defaultProvider: DefaultInterfaceProvider;

  constructor(private win: Window) {

  }

  initialize(bus: EventEmitter): void {
    this.bus = bus;
    this.unsubscribe = this.bus.on(INTERFACE_TOPIC, (e) => this.handleEvent(e));
    this.defaultProvider = new DefaultInterfaceProvider(this.win);
    setInterfaceProvider('default', this.defaultProvider);
  }

  setProvider(name: string, provider: InterfaceProvider) {
    debugIf(state.debug, `interface-provider: ${name} changed`);

    provider?.onChange('theme', (theme) => {
      this.defaultProvider.state.theme = theme;
    });

    provider?.onChange('muted', (muted) => {
      this.defaultProvider.state.muted = muted;
    });

    provider?.onChange('autoplay', (autoplay) => {
      this.defaultProvider.state.autoplay = autoplay;
    });

    setInterfaceProvider(name, provider as InterfaceProvider);
  }

  async handleEvent(actionEvent: EventAction<any>) {
    debugIf(state.debug, `document-listener: action received ${JSON.stringify(actionEvent)}`);

    if (actionEvent.command === INTERFACE_COMMANDS.RegisterProvider) {
      const { name = 'unknown', provider } = actionEvent.data;
      if (provider) {
        this.setProvider(name, provider);
      }
    } else {
      const currentProvider = getInterfaceProvider();
      const commandFuncKey = kebabToCamelCase(actionEvent.command);

      // use the registered provider unless it doesn't implement this command
      const commandFunc = currentProvider[commandFuncKey]
        // fallback to the built-in provider
        || this.defaultProvider[commandFuncKey];
      if (commandFunc && typeof commandFunc === 'function') {
        await commandFunc(actionEvent.data);
      }
    }
  }

  destroy(): void {
    this.unsubscribe();
  }
}
