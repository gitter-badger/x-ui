export class ActionEvent<T> {
  topic: string;
  command: string;
  data: T;
}
