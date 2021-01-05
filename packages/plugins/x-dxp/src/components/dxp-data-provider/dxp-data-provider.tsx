/* eslint-disable no-return-assign */
import { Component, Element } from '@stencil/core';
import {
  IDataProvider,
  EventAction,
  DATA_COMMANDS,
  DataProviderRegistration,
  DATA_TOPIC,
  DATA_EVENTS,
  EventEmitter
} from '@viewdo/x-ui';
import { onChange, state } from '../../services';

@Component({
  tag: 'dxp-data-provider',
  shadow: false,
})
export class DXPDataProvider {
  @Element() el: HTMLDxpDataProviderElement;

  componentWillLoad() {
    const provider:IDataProvider = {
      get: async (key) => state.experience ? state.experience[key] : null,
      set: (key, value) => state.experience?.setData(key, value),
      changed: new EventEmitter
    }

    const register = () => {
      const customEvent = new CustomEvent<EventAction<DataProviderRegistration>>('eventAction', {
        detail: {
          topic: DATA_TOPIC,
          command: DATA_COMMANDS.RegisterDataProvider,
          data: {
            name: 'dxp',
            provider: provider,
          },
        }
      });
      this.el.ownerDocument.body?.dispatchEvent(customEvent);
    }

    onChange('experience', () => {
      provider.changed.emit(DATA_EVENTS.DataChanged);
    });

    register();
  }

  render() {
    return null;
  }
}
