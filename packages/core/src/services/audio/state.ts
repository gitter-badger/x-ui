import { createStore } from '@stencil/store';

class StateModel {
  hasAudio: boolean;
  tracked: Array<string>;
}

const { state, onChange } = createStore<StateModel>({
  hasAudio: false,
  tracked: [],
});

export {
  state as audioState,
  onChange,
};
