import { createStore } from '@stencil/store';

class StateModel {
  debug: boolean;
  theme: 'light' | 'dark' | string;
  muted: boolean;
  autoplay: boolean;
  hasAudio: boolean;
  storedVisits: Array<string>;
  sessionVisits: Array<string>;
}

const { state, onChange } = createStore<StateModel>({
  debug: false,
  theme: localStorage.getItem('theme') || null,
  muted: localStorage.getItem('muted') === 'true',
  autoplay: localStorage.getItem('autoplay') === 'true',
  hasAudio: false,
  storedVisits: [],
  sessionVisits: [],
});

onChange('theme', (t) => localStorage.setItem('theme', t.toString()));
onChange('muted', (m) => localStorage.setItem('muted', m.toString()));
onChange('autoplay', (a) => localStorage.setItem('autoplay', a.toString()));

export {
  state,
  onChange,
};
