
export class ActionCommand {
  topic: string;
  command: string;
  data: { [index: string]: string; };
  event: CustomEvent;
}
