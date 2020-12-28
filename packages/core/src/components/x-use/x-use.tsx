import { Component, Element, Prop} from '@stencil/core';
import { hasReference, markReference } from '../../services';

@Component({
  tag: 'x-use',
  shadow: false,
})
export class XUse {
  @Element() el: HTMLXUseElement;

  /**
   * The css file to reference
   */
  @Prop() styleSrc: string;

  /**
   * The script file to reference.
   */
  @Prop() scriptSrc: string;

  /**
   * When inline the link/script tags are rendered in-place
   * rather than added to the head.
   */
  @Prop() inline: boolean;

  async componentWillLoad() {
    const elem = this.inline ? this.el : this.el.ownerDocument?.head;
    const resultsAggregator = [];

    resultsAggregator.push(new Promise((resolve) => {
      // resolve the style reference
      if (this.styleSrc && !hasReference(this.styleSrc)) {
        const link = document?.createElement("link");
        link.href = this.styleSrc;
        link.rel = "stylesheet"
        link.onload = () => {
          markReference(this.styleSrc);
          resolve({});
        }
        elem.appendChild(link)
      } else return Promise.resolve();
    }));

    resultsAggregator.push(new Promise((resolve) => {
      // make the style reference
      if (this.scriptSrc && !hasReference(this.scriptSrc)) {
        const script = document?.createElement("script");
        script.src = this.scriptSrc;
        script.onload = () => {
          markReference(this.scriptSrc);
          resolve({});
        }
        elem.appendChild(script)
      } else return Promise.resolve();
    }));

    return Promise.all(resultsAggregator);
  }
}
