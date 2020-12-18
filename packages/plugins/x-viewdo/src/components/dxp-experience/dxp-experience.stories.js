// @ts-ignore
import readme from './readme.md';

export default {
  title: 'DXP Experience Host',
  parameters: {
    markdown: readme,
  },
};

export const Default = () => `
  <dxp-experience story-key="sample" namespace="develop"></dxp-experience>
`;
