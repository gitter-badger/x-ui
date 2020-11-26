

export const ACTION_EVENT_PREFIX = "xui:action-event:";

export class ActionEvent {
  command: string;
  data: { [index: string]: string; };
  event: CustomEvent;
}
