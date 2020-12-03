import { createStore } from '@stencil/store';
import { getSessionVisits, getStoredVisits, setStoredVisits, setSessionVisits } from './visit-tracker';

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

onChange('storedVisits', async (a) => setStoredVisits(a));
onChange('sessionVisits', async (a) => setSessionVisits(a));
getStoredVisits()
  .then((v) => {
    state.storedVisits = v;
  });

getSessionVisits()
  .then((v) => {
    state.sessionVisits = v;
  });

export {
  state,
  onChange,
};
