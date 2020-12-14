import { Element, Host, Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';
import { ActionEvent } from '../../services/actions';
import { DATA_TOPIC, DATA_COMMANDS, ProviderRegistration, DATA_EVENTS, CookieConsent } from '../..';
import { CookieProvider, debugIf, evaluatePredicate, state } from '../../services';

@Component({
  tag: 'x-data-provider-cookie',
  styleUrl: 'x-data-provider-cookie.scss',
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
    bubbles: true,
    composed: true,
    cancelable: true,
  }) register: EventEmitter<ActionEvent<ProviderRegistration>>;

  /**
   * This event is raised when the component loads.
   * The data-provider system should capture this event
   * and register the provider for use in expressions.
   */
  @Event({
    eventName: DATA_TOPIC,
    bubbles: true,
    composed: true,
    cancelable: true,
  }) didConsent: EventEmitter<ActionEvent<CookieConsent>>;

  private consentKey = 'cookie-consent';

  async componentWillLoad() {
    debugIf(state.debug, 'cookie-data-provider: loading');
    const consented = await this.customProvider.get(this.consentKey);
    if (consented) {
      this.hide = true;
      return;
    }
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
        topic: DATA_TOPIC,
        command: DATA_COMMANDS.RegisterDataProvider,
        data: {
          name: 'cookie',
          provider: this.customProvider,
        },
      });
      this.customProvider.set(this.consentKey, 'true');
    }
    this.didConsent.emit({
      topic: DATA_TOPIC,
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
        <div>
          <slot/>
          <button type="button" onClick={() => this.handleConsentResponse(true)}>Accept</button>
        </div>
      </Host>
    );
  }
}
