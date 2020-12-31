import { Component, h, Prop, EventEmitter, Event, Watch, Element, Host } from '@stencil/core';
import { ISwipeEvent } from '../..';

@Component({
  tag: 'x-swipe',
  styleUrl: 'x-swipe.css',
  shadow: false
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
  @Prop() timeThreshold: number = 500
  @Watch('timeThreshold')
  validateTimeThreshold(newValue: number) {
    const isUndefined = typeof newValue === 'undefined' || newValue === null;
    if (isUndefined) { throw new Error('Invalid time threshold') };
  }

  /**
   * How many units must be covered in the x-axis to
   * determine if it was a swipe
  */
  @Prop() thresholdX: number = 80
  @Watch('thresholdX')
  validateThresholdX(newValue: number) {
    const isUndefined = typeof newValue === 'undefined' || newValue === null;
    if (isUndefined) { throw new Error('Invalid threshold X') };
  }

  /**
   * How many units must be covered in the y-axis to determine if it was a swipe
   */
  @Prop() thresholdY: number = 80

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

  private handleTouchStart(e: TouchEvent) {
    this.startX = e.touches[0].clientX; //This is where touchstart coordinates are stored
    this.startY = e.touches[0].clientY;;

    this.time = setInterval(() => { //Let's see how long the swipe lasts.
      this.totalTime += 100;
    }, 100);
  }

  private handleTouchEnd(e: TouchEvent) {
    this.endX = e.changedTouches[0].clientX;
    this.endY = e.changedTouches[0].clientY;
    clearInterval(this.time);
    if (this.totalTime >= this.timeThreshold) {
      const res = this.calculateSwipeDirection(
        this.startX,
        this.startY,
        this.endX,
        this.endY,
        this.thresholdX,
        this.thresholdY)
      this.swipe.emit(res);
    }
    this.totalTime = 0;
  }

  /**
  * Calculate the swipe direction and determine the swipe events
  */
 private calculateSwipeDirection = (
   startX: number,
   startY: number,
   endX: number,
   endY: number,
   thresholdX: number,
   thresholdY: number): ISwipeEvent => {
    var swipeDirection: ISwipeEvent = {
      up: false,
      right: false,
      down: false,
      left: false
    };
    if (startY < endY && endY - startY >= thresholdY)
      swipeDirection.down = true
    else if (startY > endY && startY - endY >= thresholdY)
      swipeDirection.up = true;

    if (swipeDirection.up || swipeDirection.down) {
      return swipeDirection;
    }

    if (startX > endX && startX - endX >= thresholdX)
      swipeDirection.left = true;
    else if (startX < endX && endX - startX >= thresholdX)
      swipeDirection.right = true;

    return swipeDirection;
  }

  render() {
    return (
      <Host>
      </Host>
    );
  }
}
