import { logger, valueProviderFactory } from './';

export class DoRuleService {

  constructor(
    public when: string,
    public whenKey: string,
    public whenProvider: string = 'session',
    doneFunc: (done:boolean) => void
    )
  {
    this.evaluateWhen().then(doneFunc);
  }

  async evaluateWhen(): Promise<boolean> {

    if(this.whenProvider && this.whenKey) {
      let provider = valueProviderFactory.getProvider(this.whenProvider);
      let value = await provider.get(this.whenKey);

      if (this.when == undefined) {
        let result = (value !== undefined && value !== null);
        logger.debug(` expression: ${this.when}} is defined = ${result}`);
        return result;
      }

      try {
        let expressionFunc = new Function("x", `return (${this.when})`);
        let result = expressionFunc(value) == true;
        logger.debug(` expression: ${this.when} = ${result}`);
        return result;
      } catch (err) {
        logger.debug(` expression: ${this.when} threw an error: ${err}`);
      }
    }
    return false;
  }
}
