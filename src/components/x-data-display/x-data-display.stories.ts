import { html } from 'lit-html';
import markdown from './readme.md';

const args = {
  class: '',
  expression: '{sample:test}',
};

// https://storybook.js.org/docs/react/writing-stories/parameters
export default {
  title: 'Data Provider/x-data-display',
  component: 'x-data-display',
  subcomponents: ['x-data-provider-sample'],
  parameters: {
    notes: {markdown},
  },
};

const Template = (
  {
    class: className,
    expression,
  }) => html`
  <h2>x-data-display</h2>
  <h3>Expression: "${expression}"</h3>
  <h4 style="background-color:white;padding:1em;">
    Results:
    <x-data-display
      class="${className}"
      from="${expression}">
    </x-data-display>
  </h4>

  <h2>Data Provider: Sample</h2>
  <p>Add values and watch them change.</p>
  <x-data-provider-sample
    name="sample"
    debug="true"/>
`;

export const Default = Template.bind({});

Default.args = {...args};
