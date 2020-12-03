/* eslint-disable no-return-assign */
// import { Component, h, Prop, State} from '@stencil/core';
// import { state, onChange } from '../../services';
// // import { filter } from 'rxjs/operators';
// // import '@vime/core';
//
// // TODO: Encapsulate like: https://github.com/CookieCookson/stencil-video-player/blob/master/src/components/video-player/video-player.tsx
// @Component({
//   tag: 'x-video-player',
//   styleUrl: 'video-player.css',
//   shadow: true,
// })
// export class VideoPlayer {
//   private subscription: any;
//   // private player: HTMLVimePlayerElement;
//
//   /** */
//   @Prop() settings!: any;
//
//   /** */
//   @Prop() personalizations: any[];
//
//   @State() currentTime = 0;
//
//   @State() muted: boolean = state.muted;
//
//   // private playHandler() {
//   //   //this.player.play();
//   // }
//
//   // private pauseHandler() {
//   //   this.player.pause();
//   // }
//
//   private onTimeUpdate(event: CustomEvent<number>) {
//     this.currentTime = event.detail;
//     // clearly this will need to be better done, we need
//     // to eliminate all non-always events that happened.
//     // this.state.cuePoints?.filter(q => q.timeAt < this.currentTime &&
//     //                                q.endAt > this.currentTime)
//     //                      .forEach(q => actionDispatcher.sendActionEvent(q));
//     //
//   }
//
//   private onPlaybackReady() {
//     // this.state.onVideoReady?.forEach(a => actionDispatcher.sendActionEvent(a));
//
//     if (!state.hasAudio) this.player.play();
//   }
//
//   private onPlaybackEnded() {
//     // this.state.onVideoEnd?.forEach(a => actionDispatcher.sendActionEvent(a));
//   }
//
//   public disconnectedCallback(): void {
//     // this.player.pause();
//     this.subscription.unsubscribe();
//   }
//
//   componentDidLoad() {
//     onChange('muted', (m) => this.muted = m);
//
//     // this.subscription = actionDispatcher.actions$
//     //   .pipe(filter(e => e.eventName == 'dxp:video'))
//     //   .subscribe(async a => {
//     //   if(a.args.command == 'pause')
//     //     await this.player.pause();
//     // });
//   }
//
//   // render() {
//   //   const { id, inline: playsinline, poster, youtubeId, vimeoId, sources } = this.settings;
//   //   const { autoplay, theme } = state;
//   //   return (
//   //     <vime-player
//   //       id={id}
//   //       theme={theme}
//   //       playsinline={playsinline}
//   //       autoplay={autoplay}
//   //       controls
//   //       muted={this.muted}
//   //       onVCurrentTimeChange={this.onTimeUpdate.bind(this)}
//   //       onVPlaybackReady={this.onPlaybackReady.bind(this)}
//   //       onVPlaybackEnded={this.onPlaybackEnded.bind(this)}
//   //       ref={(el: HTMLVimePlayerElement) => { this.player = el; }} >
//   //       {youtubeId
//   //         ? <vime-youtube videoId={youtubeId} />
//   //         : undefined}
//   //       {vimeoId
//   //         ? <vime-vimeo videoId={vimeoId} />
//   //         : undefined}
//   //       {sources
//   //         ? [<vime-video
//   //             crossOrigin=""
//   //             poster={poster}>
//   //           {sources?.map((s) => <source data-src={s.src} type={s.type || 'video/mp4'} />)}
//   //            </vime-video>,
//   //           <vime-default-ui>
//   //             {this.personalizations?.map((p) => <div id={p.id} innerHTML={p.html}></div>)}
//   //           </vime-default-ui>]
//   //         : undefined}
//   //     </vime-player>
//   //   );
//   // }
// }
//
