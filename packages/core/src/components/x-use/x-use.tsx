import { Component, Element, Prop } from '@stencil/core';
import { hasReference, markReference } from '../../services';

/**
 *  @system content
 */
@Component({
  tag: 'x-use',
  shadow: false,
})
export class XUse {
  @Element() el: HTMLXUseElement;

  /**
   * The css file to reference
   */
  @Prop() styleSrc?: string;

  /**
   * The script file to reference.
   */
  @Prop() scriptSrc?: string;

  /**
   * Import the script file as a module.
   */
  @Prop() module: boolean;

  /**
   * Declare the script only for use when
   * modules aren't supported
   */
  @Prop() noModule: boolean;

  /**
   * When inline the link/script tags are rendered in-place
   * rather than added to the head.
   */
  @Prop() inline: boolean;

  /**
   *
   */
  @Prop() nowait: boolean;

  private getStylePromise(elem) {
    if (this.styleSrc && !hasReference(this.styleSrc)) {
      return new Promise(resolve => {
        const link = this.el.ownerDocument.createElement('link');
        link.href = this.styleSrc;
        link.rel = 'stylesheet';
        link.onload = () => {
          markReference(this.styleSrc);
          resolve({});
        };
        elem.appendChild(link);
        if (this.nowait) resolve({});
      });
    } else return Promise.resolve();
  }

  private getScriptPromise(elem) {
    // make the style reference
    if (this.scriptSrc && !hasReference(this.scriptSrc)) {
      return new Promise(resolve => {
        const script = this.el.ownerDocument.createElement('script');
        script.src = this.scriptSrc;
        if (this.module) {
          script.type = 'module';
        } else if (this.noModule) {
          script.noModule = true;
        }
        script.onload = () => {
          markReference(this.scriptSrc);
          resolve({});
        };
        elem.appendChild(script);
        if (this.nowait) resolve({});
      });
    } else return Promise.resolve();
  }

  async componentWillLoad() {
    const elem = this.inline ? this.el : this.el.ownerDocument.head;
    const resultsAggregator = [];

    resultsAggregator.push(this.getStylePromise(elem));

    resultsAggregator.push(this.getScriptPromise(elem));

    return Promise.all(resultsAggregator);
  }
}
