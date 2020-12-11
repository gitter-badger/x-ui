import { evaluatePredicate, hasExpression, resolveExpression } from './data/expression-evaluator';

export async function resolveElementVisibility(element: HTMLElement) {
  const hideWhenElements = element.querySelectorAll('*[hide-when]');
  hideWhenElements.forEach(async (el) => {
    const expression = el.getAttribute('hide-when');
    if (hasExpression(expression)) {
      const hide = await evaluatePredicate(expression);
      if (hide) {
        el.setAttribute('hidden', '');
      } else {
        el.removeAttribute('hidden');
      }
    }
  });

  const showWhenElements = element.querySelectorAll('*[show-when]');
  showWhenElements.forEach(async (el) => {
    const expression = el.getAttribute('show-when');
    if (hasExpression(expression)) {
      const show = await evaluatePredicate(expression);
      if (show) {
        el.removeAttribute('hidden');
      } else {
        el.setAttribute('hidden', '');
      }
    }
  });
}

export function resolveElementVisibilityByTime() {
  
}

export async function resolveElementValues(element:HTMLElement) {
  const valueElements = element.querySelectorAll('*[value-from]');
  valueElements.forEach(async (el) => {
    const expression = el.getAttribute('value-from');
    if (hasExpression(expression)) {
      const value = await resolveExpression(expression);
      el.setAttribute('value', value);
    }
  });
}
