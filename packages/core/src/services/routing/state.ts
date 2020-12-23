import { createStore } from '@stencil/store';

class StateModel {
  storedVisits: Array<string>;
  sessionVisits: Array<string>;
}

const { state, onChange } = createStore<StateModel>({
  storedVisits: [],
  sessionVisits: [],
});

export {
  state,
  onChange,
};
