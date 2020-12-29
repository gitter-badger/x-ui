import { Element, Host, Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';
import {
  ActionEvent,
  DATA_TOPIC, DATA_COMMANDS,
  DataProviderRegistration,
  CookieConsent,
  CookieProvider,
  evaluatePredicate,
} from '../..';

/**
 *  @system data
 */
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
    eventName: 'actionEvent',
    bubbles: true,
    composed: true,
    cancelable: true,
  }) register: EventEmitter<ActionEvent<DataProviderRegistration>>;

  /**
   * This event is raised when the consents to cookies.
   */
  @Event({
    eventName: 'didConsent',
    bubbles: true,
    composed: true,
    cancelable: true,
  }) didConsent: EventEmitter<CookieConsent>;

  private consentKey = 'cookie-consent';

  async componentWillLoad() {
    const consented = await this.customProvider.get(this.consentKey);
    if (consented) {
      this.hide = true;
      this.register.emit({
        topic: DATA_TOPIC,
        command: DATA_COMMANDS.RegisterDataProvider,
        data: {
          name: 'cookie',
          provider: this.customProvider,
        },
      });
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
    this.didConsent.emit({consented});
    this.hide = true;
  }

  render() {
    return (
      <Host hidden={this.hide}>
        <div part="container">
          <slot></slot>
          <button part="accept-button" type="button" onClick={() => this.handleConsentResponse(true)}>Accept</button>
          <button part="reject-button" type="button" onClick={() => this.handleConsentResponse(false)}>No Thanks</button>
        </div>
      </Host>
    );
  }
}
