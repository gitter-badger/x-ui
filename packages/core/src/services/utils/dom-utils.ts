/* istanbul ignore file */

import { evaluatePredicate, hasExpression, resolveExpression } from '..';
import { debugIf } from '../logging';

export type TimedNode = {
  start: number;
  end: number;
  classIn: string | null;
  classOut: string | null;
  element: HTMLElement;
};

export function wrapFragment(html: string, slot?: string, id?: string): HTMLDivElement {
  const wrapper = document.createElement('div');
  if (slot) wrapper.slot = slot;
  if (id) wrapper.id = id;
  wrapper.innerHTML = html;
  return wrapper;
}

export async function resolveElementVisibility(element: HTMLElement) {
  element.querySelectorAll('[x-hide-when]').forEach(async el => {
    const expression = el.getAttribute('x-hide-when');
    const hide = await evaluatePredicate(expression);
    if (hide) {
      el.setAttribute('hidden', '');
    } else {
      el.removeAttribute('hidden');
    }
  });

  element.querySelectorAll('[x-show-when]').forEach(async el => {
    const expression = el.getAttribute('x-show-when');
    const show = await evaluatePredicate(expression);

    if (show) {
      el.removeAttribute('hidden');
    } else {
      el.setAttribute('hidden', '');
    }
  });
}

export function captureElementChildTimedNodes(el: HTMLElement, defaultDuration: number) {
  const timedNodes: Array<TimedNode> = [];
  el.querySelectorAll('[x-in-time], [x-out-time]').forEach((element: HTMLElement) => {
    timedNodes.push({
      start: parseFloat(element.getAttribute('x-in-time')) || 0,
      end: parseFloat(element.getAttribute('x-out-time')) || defaultDuration,
      classIn: element.getAttribute('x-in-class'),
      classOut: element.getAttribute('x-out-class'),
      element,
    });
  });
  return timedNodes;
}

export function resolveElementChildTimedNodesByTime(element: HTMLElement, timedNodes: Array<TimedNode>, time: number, duration: number, debug: boolean) {
  timedNodes.forEach(node => {
    if (node.start > -1 && time >= node.start && (node.end > -1 ? time < node.end : true)) {
      debugIf(debug, `x-view-do: node ${node.element.id} is after start: ${node.start} before end: ${node.end}`);
      // time is after start and before end, if it exists
      if (node.classIn) {
        // if a class-in was specified and isn't on the element, add it
        if (!node.element.classList.contains(node.classIn)) {
          debugIf(debug, `x-view-do: node ${node.element.id} is after start: ${node.start} before end: ${node.end} [adding classIn: ${node.classIn}]`);
          node.element.classList.add(node.classIn);
        }
      }

      if (node.element.hasAttribute('hidden')) {
        debugIf(debug, `x-view-do: node ${node.element.id} is after start: ${node.start} before end: ${node.end} [removing hidden attribute]`);
        // otherwise, if there's a hidden attribute, remove it
        node.element.removeAttribute('hidden');
      }
    }

    if (node.end > -1 && time > node.end) {
      // time is after end, if it exists
      debugIf(debug, `x-view-do: node ${node.element.id} is after end: ${node.end}`);
      if (node.classIn && node.element.classList.contains(node.classIn)) {
        debugIf(debug, `x-view-do: node ${node.element.id} is after end: ${node.end}  [removing classIn: ${node.classIn}]`);
        // remove the in class, if it exists
        node.element.classList.remove(node.classIn);
      }

      if (node.classOut) {
        // if a class-out was specified and isn't on the element, add it
        if (!node.element.classList.contains(node.classOut)) {
          debugIf(debug, `x-view-do: node ${node.element.id} is after end: ${node.end} [adding classOut: ${node.classOut}]`);
          node.element.classList.add(node.classOut);
        }
      } else if (!node.element.hasAttribute('hidden')) {
        // otherwise, if there's no hidden attribute, add it
        debugIf(debug, `x-view-do: node ${node.element.id} is after end: ${node.end} [adding hidden attribute]`);
        node.element.setAttribute('hidden', '');
      }
    }
  });

  // resolve x-time-to
  const timeValueElements = element.querySelectorAll('[x-time-to]');
  timeValueElements.forEach(el => {
    const seconds = Math.floor(time);
    const attributeName = el.getAttribute('x-time-to');
    if (attributeName) {
      el.setAttribute(attributeName, seconds.toString());
    } else {
      el.childNodes.forEach(cn => el.removeChild(cn));
      el.appendChild(document.createTextNode(seconds.toString()));
    }
  });

  // resolve x-percentage-to
  const timePercentageValueElements = element.querySelectorAll('[x-percentage-to]');
  timePercentageValueElements.forEach(el => {
    const attributeName = el.getAttribute('x-percentage-to');
    const percentage = time / duration;
    if (attributeName) {
      el.setAttribute(attributeName, percentage.toString());
    } else {
      el.childNodes.forEach(cn => el.removeChild(cn));
      el.appendChild(document.createTextNode(`${Math.round(percentage * 100)}%`));
    }
  });
}

export function restoreElementChildTimedNodes(element: HTMLElement, timedNodes: Array<TimedNode>) {
  timedNodes.forEach(node => {
    if (node.classIn && node.element.classList.contains(node.classIn)) {
      node.element.classList.remove(node.classIn);
    }

    if (node.classOut && node.element.classList.contains(node.classOut)) {
      node.element.classList.remove(node.classOut);
    }

    if (!node.element.hasAttribute('hidden')) {
      node.element.setAttribute('hidden', '');
    }
  });

  // resolve x-time-to
  const timeValueElements = element.querySelectorAll('[x-time-to]');
  timeValueElements.forEach(el => {
    const attributeName = el.getAttribute('x-time-to');
    if (attributeName) {
      el.setAttribute(attributeName, '0');
    } else {
      el.childNodes.forEach(cn => el.removeChild(cn));
      el.appendChild(document.createTextNode('0'));
    }
  });

  // resolve x-percentage-to
  const timePercentageValueElements = element.querySelectorAll('[x-percentage-to]');
  timePercentageValueElements.forEach(el => {
    const attributeName = el.getAttribute('x-percentage-to');
    if (attributeName) {
      el.setAttribute(attributeName, '0');
    } else {
      el.childNodes.forEach(cn => el.removeChild(cn));
      el.appendChild(document.createTextNode('0%'));
    }
  });
}

export async function resolveElementValues(element: HTMLElement) {
  element.querySelectorAll('[x-value-from]').forEach(async el => {
    const expression = el.getAttribute('x-value-from');
    if (hasExpression(expression)) {
      const value = await resolveExpression(expression);
      el.setAttribute('value', value);
    }
  });
}

export function removeAllChildNodes(parent: HTMLElement) {
  while (parent?.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
