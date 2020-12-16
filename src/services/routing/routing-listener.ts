import { ROUTE_TOPIC, NavigateTo, NavigateNext, ROUTE_COMMANDS } from './interfaces';
import { ActionEvent, IActionEventListener } from '../actions';
import { debugIf } from '../logging';
import { state } from '../state';
import { RouterService } from './router-service';
import { EventEmitter } from '../actions/event-emitter';

export class RoutingListener implements IActionEventListener {
  bus: EventEmitter;
  unsubscribe: () => void;
  public initialize(bus: EventEmitter) {
    this.bus = bus;
    this.unsubscribe = this.bus.on(ROUTE_TOPIC, (e) => this.handleEvent(e));
  }

  handleEvent(actionEvent: ActionEvent<NavigateTo|NavigateNext>) {
    debugIf(state.debug, `routing-listener: action received ${JSON.stringify(actionEvent)}`);

    if (actionEvent.command === ROUTE_COMMANDS.NavigateNext) {
      RouterService.instance?.returnToParent();
    } else if (actionEvent.command === ROUTE_COMMANDS.NavigateTo) {
      const { url } = actionEvent.data as NavigateTo;
      RouterService.instance?.history.push(url);
    }
  }

  destroy(): void {
    this.unsubscribe();
  }
}
