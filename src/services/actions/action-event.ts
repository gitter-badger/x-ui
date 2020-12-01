export class ActionEvent {
  command: string;
  data: { [index: string]: string; };
  event: CustomEvent;
}
