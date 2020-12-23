import { Component, Prop, Event, EventEmitter, h, State, Method, Element } from '@stencil/core';
import { getXAPIUrlFromNamespace } from '../../services/api.conventions';
import { onChange, logger, urlService as url, state } from '../../services';
import { promiseTimeout } from '../../services/utils';
import { Experience, ExperienceInformation } from '../..';
import { Namespace } from '../../models/namespace';
import { ExperienceController } from '../../services/experience.service';

@Component({
  tag: 'dxp-experience',
  styleUrl: 'dxp-experience.scss',
  shadow: true,
})
export class DXPExperience {

  controller: ExperienceController;

  /**
   * Experience state.
   */
  @State() experience: Experience;

  @State() started = 0.0;

  @Element()
  el: HTMLElement

  //#region Properties

  /**
   * Enable Debug mode to prevent API calls.
   * (falls back to ?debug )
   * @default false
   */
  @Prop() debug = url.debug;

  /**
   * Enable preview mode to fake data and prevent API calls.
   * (falls back to ?preview )
   * @default false
   */
  @Prop() preview = url.preview;

  /**
   * The platform environment target. (optional)
   */
  @Prop() namespace: Namespace;

  /**
   * Experience API Url (optional)
   */
  @Prop({
    reflect: true
  }) xapiUrl: string;


  /**
   * Story Key
   * (falls back to ?storyKey )
   */
  @Prop() storyKey = url.storyKey;

  /**
   * User Key
   * (falls back to ?userKey )
   */
  @Prop() userKey = url.userKey;

  /**
   * Enable Debug mode to prevent API calls.
   * @default false
   */
  @Prop() loadAssets = false;

  /**
   * Display mode for this element.
   * @default none
   */
  @Prop() display: 'logo' | 'debug' | 'none'  = 'logo';

  /**
   * Experience data (bypasses XAPI to retrieve it)
   */
  @Prop() experienceData: string;





  /**
   * When an experience is retrieved, this event fires
   * with 'event.detail' being the full experience,
   * w/ data methods like 'setData()' and 'setComplete()'.
   */
  @Event({
    bubbles: true,
    eventName: 'dxp:initialized'
  }) initialized: EventEmitter<Experience>;

  /**
   * When an experience is unable to be retrieved, this event fires
   * with 'event.detail' = error message.
   */
  @Event({
    bubbles: true,
    eventName: 'dxp:errored'
  }) errored: EventEmitter<string>;

  /**
   * This event is raised when reset() is called.
   */
  @Event({
    bubbles: true,
    eventName: 'dxp:reset'
  }) didReset: EventEmitter<void>;

  //#endregion

  //#region Methods

  /**
   * This method resets the stored session-id & experience-key,
   * effectively resetting the current experience. Useful for testing
   * or dynamically switching experiences in-page.
   */
  @Method()
  async reset() {
    this.controller.reset();
    this.didReset.emit();
  }

  /**
   * This method gets waits for the experience.
   * @param {number} timeout
   * @return {*}  {Promise<Experience>}
   * @memberof DXPExperience
   */
  @Method()
  async getExperience(timeout: number): Promise<Experience> {
    // provide a way for components to wait for the experience
    return promiseTimeout(timeout, new Promise(async (res) => {
      while (!this.experience) {}
      res(this.experience);
    }));
  }

  //#endregion

  async componentWillLoad() {
    onChange('experience', e => {
      this.experience = e;
      this.initialized.emit(this.experience);
    });

    if(this.namespace)
      this.xapiUrl = getXAPIUrlFromNamespace(this.namespace);

    if(this.xapiUrl) {
      this.controller = new ExperienceController(
        window.document,
        this.debug,
        this.preview,
        this.loadAssets,
        this.xapiUrl,
        this.storyKey || state.experience?.story?.key || 'funnel',
        this.userKey
      );

      await this.initializeExperience();
    } else {
      logger.warn('A value for xapi-url OR namespace must be specified');
    }

  }


  async initializeExperience(): Promise<void> {

    try {
      let experienceInfo: ExperienceInformation;
      if(this.experienceData) {
        experienceInfo = new ExperienceInformation(JSON.parse(this.experienceData));
      } else {
        experienceInfo = await this.controller.getExperience();
      }
      await this.controller.startSession(experienceInfo);
      this.experience = new Experience(this.controller, experienceInfo);
      if (!this.debug && typeof process !== 'undefined') {
        this.started = performance.now();
        const terminationEvent = 'onpagehide' in self ? 'pagehide' : 'unload';
        // send the view-time to XAPI
        addEventListener(terminationEvent, () => {
          const elapsed = performance.now() - this.started;
          this.controller.unload(this.experience.key, elapsed * 1000);
        });
      }

      logger.debug(`Successfully retrieved and initialized experience
        \n\tExperience Key: [${this.experience.key}]
        \n\tStory Key: [${this.experience.story.key}]
        \n\tSession Id: [${this.experience.sessionId}]
        \n\tUrl: ${this.xapiUrl}/experience/${this.experience.key} `);

      state.experience = this.experience;

    } catch (error) {
      logger.error('Unable to init,', error)
      this.errored.emit(error);
    }
  }


  render() {

    const Container = (opts, children) => (
      <div id='viewdo' class={opts.class} part="container">
        <div id="logo">
          <a href='https://view.do' target='blank' title="Learn how to bring your static content to life with View.DO personalized experiences.">
            <img src='https://static.view.do/view-do/viewdo-logo-color.svg' />
          </a>
        </div>
        {children}
        {this.controller.message ?
            <div id="message">
              {this.controller.message}
            </div>: null}
      </div>);

    switch (this.display) {
      case 'logo':
        return (
          <Container class={'fade-in logo'}>
          </Container>);
      case 'debug':
        return (
          <Container class={'fade-in json'}>
            <hr/>
            <div id="info">
              <button onClick={async () => await this.reset()}>Reset</button>
              <h4>Experience: <span><a href={`${this.xapiUrl}/experience/${this.experience?.key}`} target="_blank">{this.experience?.key}</a></span></h4>
            </div>
            <h4>Experience JSON: </h4>
            <pre><code>{JSON.stringify(this.experience || {}, null, 2)}</code></pre>
          </Container>);
      default:
        return '';
    }
  }
}
