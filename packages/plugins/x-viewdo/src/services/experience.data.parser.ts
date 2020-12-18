import get from 'lodash/get';
import { Experience } from '../models/Experience';
import { formatter, getLocalDate } from './utils';

export type Comparison = 'gt' | 'lt' | 'eq' | 'lte' | 'gte' | 'not' | null;

export class ExperienceDataParser {

  constructor(experience: Experience) {
    this.data = {
      experience: experience,
      story: experience.story,
      organization: experience.organization,
      user: experience.user || {}
    };
  }

  data: any;

  coerce(value: any, to: any): any {

    let type = ({}).toString.call(to).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    switch (type) {
      case ('string'): return (value || '').toString();
      case ('number'): return parseInt(value || 0);
      case ('date'): return new Date(value || '');
      case ('boolean'): return (value == true);
      default: return value;
    }
  }

  modifiers = {
    clip: (v:string, l: number) => {
      l = (l > v.toString().length) ? v.length - 1 : l - 1;
      return v.toString().substring(0, l);
    },
    truncate: (v: string, l: number) => {
      l = (l > v.toString().length) ? v.length - 1 : l - 1;
      return v.toString().substring(0, l) + "...";
    },
    date: (v: string) => getLocalDate(v),
    lowercase: (v: { toString: () => string; }) => v.toString().toLowerCase(),
    uppercase: (v: { toString: () => string; }) => v.toString().toUpperCase(),
    capitalize: (v: { toString: () => string; }) => v.toString().replace(/\w\S/g, function (t) { return t.toUpperCase(); }),
    size: (v: string | any[]) => v.length || 0,
    encode: (v: string) => encodeURI(v),
    currency: (v: number | bigint) => formatter.format(v)
  };

  getValue(expression: string, modifiers?: string) {

    let value = get(this.data, expression);
    if (modifiers != undefined) {
      modifiers.split('|').forEach(modifier => {
        let parts = modifier.split(':');
        let mod = this.modifiers[parts[0]];
        if(mod == undefined) return;
        if (parts.length > 1) {
          value = mod.call(this, value, parts[1]);
        } else {
          value = mod.call(this, value);
        }
      });
    }
    return value;
  }

  getShow(expression: string, is: Comparison, to: any) {
    let value = this.getValue(expression);
    let toVal = this.coerce(to, value);
    switch (is) {
      case ('eq'): return value == toVal;
      case ('gte'): return value >= toVal;
      case ('lte'): return value <= toVal;
      case ('gt'): return value > toVal;
      case ('lt'): return value < toVal;
      case ('not'): return value != toVal;
      default: return value != undefined;
    }
  }

}
