import { Component, h, Prop, Host, Element, State } from '@stencil/core';
import { state } from '../../services';
import { RouteService, MatchResults } from "../../services/route.service";

@Component({
  tag: 'x-view',
  styleUrl: 'x-view.scss',
  shadow: true,
})
export class XView {

  @Element() el!: HTMLElement;

  @Prop() pageTitle: string = '';
  @Prop() exact: boolean = false;
  @Prop() scrollTopOffset?: number;
  @Prop() url?: string;
  @Prop() root?: string;
  @Prop() transition?: string;
  @State() match: MatchResults;
  @Prop() templateId: string;
  route: RouteService;

  // private get actions() {
  //   return Array.from<HTMLXActionElement>(this.el.querySelectorAll('x-action'));
  // }

  private get doTasks() {
    return Array.from<HTMLXDoElement>(this.el.querySelectorAll('x-do'));
  }

  private get childViews() {
    return Array.from<HTMLXViewElement>(this.el.querySelectorAll('x-view'));
  }

  connectedCallback() {
    //logger.debug(`View ${this.url} was connected`);
  }

  disconnectedCallback() {
    //logger.debug(`View ${this.url} was disconnected`);
  }

  componentWillLoad() {
    //logger.debug(`View ${this.url} will load.`);

    const self = this;
    this.route = new RouteService(
      state.router,
      this.el,
      this.root,
      this.url,
      this.exact,
      this.pageTitle,
      this.transition || state?.router?.transition,
      this.scrollTopOffset,
      match => self.match = match
    );
  }

  async componentDidUpdate() {
    //logger.debug(`View ${this.url} did update.`);
    await this.route.loadCompleted();
  }

  async componentDidLoad() {
    //logger.debug(`View ${this.url} did load.`);
    await this.route.loadCompleted();
  }

  componentWillRender() {
    //logger.debug(`View ${this.url} will render.`);

    if(this.match) {

      this.childViews.forEach(c => {
        if(!c.url.startsWith(this.url)) {
          c.url = this.url + c.url;
        }
      });

      this.doTasks.forEach(c => {
        if(!c.url.startsWith(this.url)) {
          c.url = this.url + c.url;
        }
      });
    }

    if (this.match?.isExact) {
      //logger.debug(`View ${this.url} has a matched route`);
      let nextDo = this.doTasks.find(d => d.done == false);
      if (nextDo) {
        state.logger.debug(`View ${this.url}: Go to Do: ${nextDo.url}`);
        state.router.history.push(nextDo.url);
      }
    }
  }

  render() {

    //logger.debug(`View ${this.url} is rendering with exact match: ${this.match?.isExact||false}.`);
    if(!state.router || !this.route) return null;

    const classes = this.match
      ? `active-route ${this.transition || state.router.transition || ''}`
      : '';
    return (
        <Host class={classes}>
          {this.match
            ? <slot></slot>
            : null
          }
        </Host>
      );
  }

}
