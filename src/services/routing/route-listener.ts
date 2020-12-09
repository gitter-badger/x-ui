import { ROUTE_TOPIC, NavigateTo, NavigateNext, ROUTE_COMMANDS } from './interfaces';
import { ActionEvent, IActionEventListener } from '../actions';
import { debugIf } from '../logging';
import { state } from '../state';
import { RouterService } from './router-service';

export class RouteListener implements IActionEventListener {
  document: HTMLDocument;
  eventOptions: EventListenerOptions = {
    capture: false,
  };

  public initialize(win:Window) {
    this.document = win.document;
    this.listen();
  }

  listen() {
    this.document.body.addEventListener(
      ROUTE_TOPIC,
      this.handleEvent,
      this.eventOptions);
  }

  handleEvent(ev: CustomEvent<ActionEvent<NavigateTo|NavigateNext>>) {
    const actionEvent = ev.detail;
    debugIf(state.debug, `navigation-listener: <navigation-event~${actionEvent.command}>`);
    if (actionEvent.command === ROUTE_COMMANDS.NavigateNext) {
      RouterService.instance?.returnToParent();
    }
    if (actionEvent.command === ROUTE_COMMANDS.NavigateTo) {
      const { data } = actionEvent as ActionEvent<NavigateTo>;
      RouterService.instance?.history.push(data.url);
    }
  }

  destroy(): void {
    this.document?.body?.removeEventListener(
      ROUTE_TOPIC,
      this.handleEvent,
      this.eventOptions);
  }
}
