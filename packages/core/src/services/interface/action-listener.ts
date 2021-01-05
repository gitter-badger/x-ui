import { EventAction, IEventEmitter, IEventActionListener } from '../actions';
import { debugIf } from '../logging';
import { kebabToCamelCase } from '../utils/string-utils';
import { InterfaceProvider, INTERFACE_COMMANDS, INTERFACE_TOPIC, INTERFACE_EVENTS } from './interfaces';
import { DefaultInterfaceProvider } from './providers/default';
import { getInterfaceProvider, setInterfaceProvider } from './providers/factory';
import { state } from './state';

export class InterfaceListener implements IEventActionListener {
  defaultProvider: DefaultInterfaceProvider;
  eventBus: IEventEmitter;

  initialize(
    window: Window,
    actionBus: IEventEmitter,
    eventBus: IEventEmitter): void
  {
    this.eventBus = eventBus;
    actionBus.on(INTERFACE_TOPIC, (e) => this.handleAction(e));
    this.registerBrowserProviders(window);
  }

  registerBrowserProviders(win: Window) {
    this.defaultProvider = new DefaultInterfaceProvider(win);
    setInterfaceProvider('default', this.defaultProvider);
  }

  setProvider(name: string, provider: InterfaceProvider) {
    debugIf(state.debug, `interface-provider: ${name} changed`);

    provider?.onChange('theme', (theme) => {
      this.defaultProvider.state.theme = theme;
      this.eventBus.emit(INTERFACE_EVENTS.ThemeChanged);
    });

    provider?.onChange('muted', (muted) => {
      this.defaultProvider.state.muted = muted;
      this.eventBus.emit(INTERFACE_EVENTS.SoundChanged);
    });

    provider?.onChange('autoplay', (autoplay) => {
      this.defaultProvider.state.autoplay = autoplay;
      this.eventBus.emit(INTERFACE_EVENTS.AutoPlayChanged);
    });

    setInterfaceProvider(name, provider as InterfaceProvider);
  }

  async handleAction(actionEvent: EventAction<any>) {
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

}
