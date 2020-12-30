import { Component, h, Prop, EventEmitter, Event, Watch, Element, Host } from '@stencil/core';
import { ISwipeEvent } from '../..';

@Component({
  tag: 'x-swipe',
  styleUrl: 'x-swipe.css'
})
export class XSwipe {
  @Element() el: HTMLXSwipeElement;

  // Store Position when touch begins
  private startX: number;
  private startY: number;
  // Store Position when touch ends
  private endX: number;
  private endY: number;

  // Store time
  private time: NodeJS.Timeout;
  // Total time that the swipe took
  private totalTime: number = 0;

  /**
   * The amount of touch-time required before issuing an event
  */
  @Prop() timeThreshold: number = 100
  @Watch('timeThreshold')
  validateTimeThreshold(newValue: number) {
    const isUndefined = typeof newValue === 'undefined' || newValue === null;
    if (isUndefined) { throw new Error('Invalid time threshold') };
  }

  /**
   * How many units must be covered to determine if it was a swipe
  */
  @Prop() thresholdX: number = 30
  @Watch('thresholdX')
  validateThresholdX(newValue: number) {
    const isUndefined = typeof newValue === 'undefined' || newValue === null;
    if (isUndefined) { throw new Error('Invalid threshold X') };
  }

  /**
   * How many units must be covered to determine if it was a swipe
   */
  @Prop() thresholdY: number = 30

  @Watch('thresholdY')
  validateThresholdY(newValue: number) {
    const isUndefined = typeof newValue === 'undefined' || newValue === null;
    if (isUndefined) { throw new Error('Invalid threshold Y') };
  }

  /**
  * Handle the touch start event, store the coordinates and set the timer for touch event
  */
  @Event() swipe: EventEmitter<ISwipeEvent>;

  componentDidLoad() {
    this.el.addEventListener('touchstart', (e) => {
      this.handleTouchStart(e);
    }, {
      passive: true
    });

    this.el.addEventListener('touchend', (e) => {
      this.handleTouchEnd(e);
    }, {
      passive: true
    });
  }

  // Local Methods

  private handleTouchStart(e) {
    this.startX = e.touches[0].clientX; //This is where touchstart coordinates are stored
    this.startY = e.touches[0].clientY;;

    this.time = setInterval(() => { //Let's see how long the swipe lasts.
      this.totalTime += 10;
    }, 10);
  }

  private handleTouchEnd(e) {
    this.endX = e.changedTouches[0].clientX;
    this.endY = e.changedTouches[0].clientY;
    // Let's stop calculating time and free up resources.
    clearInterval(this.time);
    if (this.totalTime >= this.timeThreshold) {
      let res = this.calculateSwipeDirection(this.startX, this.startY, this.endX, this.endY, 30, 30)
      this.swipe.emit(res);
    }
    this.totalTime = 0;
  }

  /*
  * @name calculateSwipeDirection
  * @Params
  * startX {Number} Touch event start  x-axis
  * startY {Number} Touch event start y-axis
  * endX {Number} Touch event end x-axis
  * endY {Number} Touch event end y-axis
  * thresholdX {Number}
  * thresholdY {Number}
  * @Description Calculate the swipe direction and determine the swipe events
  * @return {Object}
  * up {boolean} false
  * right {boolean} false
  * down {boolean} false
  * left {boolean} false
  */
 private calculateSwipeDirection = (startX, startY, endX, endY, thresholdX, thresholdY): ISwipeEvent => {
    var swipeDirection: ISwipeEvent = { up: false, right: false, down: false, left: false };
    if (startX > endX && startX - endX >= thresholdX)
      swipeDirection.left = true;
    else if (startX < endX && endX - startX >= thresholdX)
      swipeDirection.right = true;

    if (startY < endY && endY - startY >= thresholdY)
      swipeDirection.down = true
    else if (startY > endY && startY - endY >= thresholdY)
      swipeDirection.up = true;

    return swipeDirection;
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
