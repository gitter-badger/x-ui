import { warn } from '../../logging';

export const warning = (value:boolean, message: any) => {
  if (!value) {
    warn(message);
  }
};
