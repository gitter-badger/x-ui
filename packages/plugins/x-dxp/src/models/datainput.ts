
import { EventEmitter } from '@stencil/core';
import { StoryInput } from './storyinput';


export class DataInput {

  constructor(
    private input: StoryInput,
    value: any,
    private dataChanged: EventEmitter<{key: string, value: any}>
    ) {
    this.internalValue = value || input.value;
  }

  private internalValue: string;

  get value(): string | number | boolean | Date {
    if (this.input.display === 'Date') {
      return this.getLocalDate(this.internalValue.toString(), true);
    } else if (this.input.display === 'DateTime') {
      return this.getLocalDate(this.internalValue.toString());
    }
  }

  set value(value: string | number | boolean | Date) {
    if (this.internalValue === value.toString()) {
      return;
    }
    this.internalValue = value.toString();
    this.dataChanged.emit({ key: this.input.key, value: this.coerceType(value) })
  }

  private getLocalDate(utcDateString: string, justDate = false): string {
    const milliseconds = Date.parse(utcDateString);
    const offset = new Date().getTimezoneOffset() * 60 * 1000;
    if (!isNaN(milliseconds)) {
      const serverDate = new Date(milliseconds);
      const localDate = new Date(serverDate.getTime() - offset);

      if (justDate === true) {
        return localDate.toISOString().substr(0, 10);
      }
      return localDate.toISOString().replace('Z', '');
    }
  }

  private coerceType(value: any): string | boolean | number | Date {
    switch (this.input.type) {
      case 'Boolean':
        return value.toString() === 'true' || value.toString() === '1';
      case 'Number':
        return parseFloat(value.toString());
      case 'Date':
      case 'DateTime':
        return new Date(value.toString());
      default:
        return value;
    }
  }
}
