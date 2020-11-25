import { createStore } from "@stencil/store";
import { RouterService } from "./router.service";

class StateModel {
  router: RouterService;
  debug: boolean;
  theme: 'light' | 'dark' | string;
  muted: boolean;
  autoplay: boolean;
  hasAudio: boolean;
}

const { state, onChange } = createStore<StateModel>({
  router: null,
  debug: false,
  theme: localStorage.getItem('theme') || null,
  muted: localStorage.getItem('muted') == 'true',
  autoplay: localStorage.getItem('autoplay') == 'true',
  hasAudio: false
});

onChange('theme', t =>
  localStorage.setItem('theme', t.toString())
);

onChange('muted', m =>
  localStorage.setItem('muted', m.toString())
);

onChange('autoplay', a =>
  localStorage.setItem('autoplay', a.toString())
);

export {
  state,
  onChange
};
