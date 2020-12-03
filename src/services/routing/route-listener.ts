import { ActionEvent, IActionEventListener } from '../actions';
import { RouterService } from './router-service';

export const ROUTE_TOPIC = 'xui:action-events:routing';

export enum ROUTE_COMMANDS {
  NavigateNext = 'navigate-next',
  NavigateTo = 'navigate-to',
}

export type NavigateTo = {
  url: string;
};

export type NavigateNext = {
};

export class RouteListener implements IActionEventListener {
  document: HTMLDocument;
  eventOptions: EventListenerOptions = { capture: false };

  public initialize(win:Window) {
    this.document = win.document;
    this.listen();
  }

  listen() {
    this.document.addEventListener(
      ROUTE_TOPIC,
      this.handleEvent,
      this.eventOptions);
  }

  handleEvent(ev: CustomEvent<ActionEvent<NavigateTo|NavigateNext>>) {
    const actionEvent = ev.detail;
    if (actionEvent.command === ROUTE_COMMANDS.NavigateNext) {
      RouterService.instance.returnToParent();
    }
    if (actionEvent.command === ROUTE_COMMANDS.NavigateTo) {
      const { data } = actionEvent as ActionEvent<NavigateTo>;
      RouterService.instance.history.push(data.url);
    }
  }

  destroy(): void {
    this.document.removeEventListener(
      ROUTE_TOPIC,
      this.handleEvent,
      this.eventOptions);
  }
}
