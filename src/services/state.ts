import { createStore } from '@stencil/store';

class StateModel {
  debug: boolean;
  theme: 'light' | 'dark' | string;
  muted: boolean;
  autoplay: boolean;
  hasAudio: boolean;
  visited: Array<string>;
}

const visited = JSON.parse(localStorage.getItem('visited') || '[]');
const { state, onChange } = createStore<StateModel>({
  debug: false,
  theme: localStorage.getItem('theme') || null,
  muted: localStorage.getItem('muted') === 'true',
  autoplay: localStorage.getItem('autoplay') === 'true',
  hasAudio: false,
  visited,
});

onChange('theme', (t) => localStorage.setItem('theme', t.toString()));

onChange('muted', (m) => localStorage.setItem('muted', m.toString()));

onChange('autoplay', (a) => localStorage.setItem('autoplay', a.toString()));

onChange('visited', (a) => localStorage.setItem('visited', JSON.stringify(a)));

export {
  state,
  onChange,
};
