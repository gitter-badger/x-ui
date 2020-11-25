import { Component, h, Prop, Element, Listen, State, Host } from '@stencil/core';
import { RouteService, MatchResults } from "../../services/route.service";
import { state, session, logger } from '../../services';
import { DoRuleService } from '../../services/rule.service';

@Component({
  tag: 'x-do',
  styleUrl: 'x-do.scss',
  shadow: true,
})
export class XDo {
  @Element() el!: HTMLElement;

  @Prop() when: string;
  @Prop() whenKey!: string;
  @Prop() whenProvider: string = 'session';

  @Prop() pageTitle: string = '';
  @Prop() scrollTopOffset?: number;
  @Prop() url?: string;
  @Prop() root?: string;
  @Prop() transition: string;

  @State() match: MatchResults;
  @Prop({reflect: true}) done: boolean = false;

  whenRule: DoRuleService;
  route: RouteService;

  get parentUrl() {
    return this.el.parentElement.getAttribute('url');
  }

  get urlKey() {
    return `xui:do${this.url.split('/').join(':')}:done`;
  }

  componentWillLoad() {
    logger.debug(`Do ${this.url} will load`);
    const self = this;
    this.route = new RouteService(
      state.router,
      this.el,
      this.root,
      this.url,
      true,
      this.pageTitle,
      this.transition,
      this.scrollTopOffset,
      match => self.match = match
    );
  }

  async componentDidUpdate() {
    logger.debug(`Do ${this.url} did update`);
    await this.route.loadCompleted();
  }

  async componentWillRender() {
    logger.debug(`Do ${this.url} will render`);
    // before evaluating the condition, check if we already did this
    let hasDone = await session.get(this.urlKey);
    if(hasDone != null)
      this.done = true;
    else
      this.whenRule = new DoRuleService(
        this.when,
        this.whenKey,
        this.whenProvider,
        done => {
          this.done = done;
          logger.debug(`Do ${this.url} done callback: ${this.done}`);
        }
      );

    if(this.match?.isExact) {
      logger.debug(`Do ${this.url} has matched route`);
    }
    await this.route.loadCompleted();
  }


  @Listen('x-do:complete', {
    capture: true
  })
  onComplete() {
    if(this.route.match.isExact) {
      session.set(this.urlKey, "true");
      this.done = true;
      state.router.history.push(this.parentUrl);
    }
  }

  disconnectedCallback() {
    //this.route.unload();
    logger.debug(`Do ${this.url} was disconnected`);
  }

  render() {
    logger.debug(`Do ${this.url} is rendering`);
    const classes = `overlay ${this.transition || state.router.transition}`;

    return (this.match?.isExact
      ? <Host class={classes}>
          <slot></slot>
        </Host>
      : null
    );
  }

  componentDidRender() {
    logger.debug(`Do ${this.url} did render`);
  }


  componentDidLoad() {
    logger.debug(`Do ${this.url} did load`);
  }
}
