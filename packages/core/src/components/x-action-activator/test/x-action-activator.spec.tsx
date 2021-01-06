jest.mock('../../../services/logging');
jest.mock('../../../services/logging');

import { newSpecPage } from '@stencil/core/testing';
import { XActionActivator } from '../x-action-activator';
import { XAction } from '../../x-action/x-action';
import { actionBus } from '../../../services';

describe('x-action-activator', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XActionActivator],
      html: `<x-action-activator></x-action-activator>`,
    });
    expect(page.root).toEqualHtml(
      `<x-action-activator>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </x-action-activator>`,
    );
  });

  it('captures child actions', async () => {
    const page = await newSpecPage({
      components: [XActionActivator, XAction],
      html: `<x-action-activator activate="OnEnter">
               <x-action topic="test" command="pass"></x-action
             </x-action-activator>`,
    });

    const activator = page.body.querySelector('x-action-activator');
    expect(activator).toBeDefined();

    let command = null;
    actionBus.on('test', e => {
      command = e.command;
    });

    await activator.activateActions();

    expect(command).toBe('pass');
  });
});
