jest.mock('../../../services/logging');

import { newSpecPage } from '@stencil/core/testing';
import { XActionActivator } from '../x-action-activator';


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
      </x-action-activator>`
    );
  });

})
