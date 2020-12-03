import { Element, Host, Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';
import { ActionEvent } from '../../services/actions';
import { DATA_TOPIC, DATA_COMMANDS, ProviderRegistration, DATA_EVENTS, CookieConsent } from '../../services/data/provider-listener';
import { CookieProvider, evaluatePredicate } from '../../services';

@Component({
  tag: 'x-data-provider-cookie',
  shadow: true,
})
export class XDataProviderCookie {
  private customProvider = new CookieProvider();
  @Element() el: HTMLXDataProviderCookieElement;
  @State() hide = false;

  /**
   * An expression that tells this component how to determine if
   * the user has previously consented.
   * @example {storage:consented}
   */
  @Prop() hideWhen: string;

  /**
   * When skipConsent is true, the accept-cookies banner will not
   * be displayed before accessing cookie-data.
   */
  @Prop() skipConsent = false;

  /**
   * This event is raised when the component obtains
   * consent from the user to use cookies.
   * The data-provider system should capture this event
   * and register the provider for use in expressions.
   */
  @Event({
    eventName: DATA_TOPIC,
  }) register: EventEmitter<ActionEvent<ProviderRegistration>>;

  /**
   * This event is raised when the component loads.
   * The data-provider system should capture this event
   * and register the provider for use in expressions.
   */
  @Event({
    eventName: DATA_TOPIC,
  }) didConsent: EventEmitter<ActionEvent<CookieConsent>>;

  async componentWillRender() {
    if (this.hideWhen) {
      this.hide = await evaluatePredicate(this.hideWhen);
    }
    if (this.skipConsent) {
      this.hide = true;
    }
  }

  private handleConsentResponse(consented: boolean) {
    if (consented) {
      this.register.emit({
        command: DATA_COMMANDS.RegisterDataProvider,
        data: {
          name: 'cookie',
          provider: this.customProvider,
        },
      });
    }
    this.didConsent.emit({
      command: DATA_EVENTS.CookieConsentResponse,
      data: {
        consented,
      },
    });
    this.hide = consented;
  }

  render() {
    return (
      <Host hidden={this.hide}>
        <button type="button" onClick={() => this.handleConsentResponse(true)}>Accept</button>
        <slot/>
      </Host>
    );
  }
}