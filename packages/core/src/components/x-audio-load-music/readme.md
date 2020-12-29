# X-AUDIO-LOAD-MUSIC

This component declares the payload for a given Event Action to be submitted to the bus upon route activation. All **`x-audio-load-*`** elements are sent to the player when the route is active and the player manages them according to their settings.  

## Usage

````html
<x-view-do>
  <x-audio-load-music
    load="queue|interrupt|hold"
    id="<unique-id>"
    src="<url>"    
    discard="route|video|next|none"
    loop
    track
    ></x-audio-load-music>
    
</x-view-do>
````

### Simple

````html
<x-view-do>
  <x-audio-load-music    
    id="<unique-id>"
    src="<url>"></x-audio-load-music>
    
</x-view-do>
````



### Ambient Looped
This will play until something replaces it or until a pause command is received.

````html
<x-view-do>
  <x-audio
    load="queue"
    id="<unique-id>"
    src="<url>"    
    discard="none"
    loop></x-audio>
    
</x-view-do>
````



All audio files are 



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute  | Description                                                                                                 | Type                                                                                             | Default                 |
| ------------------ | ---------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------- |
| `discard`          | `discard`  | The discard strategy the player should use for this file.                                                   | `DiscardStrategy.Next \| DiscardStrategy.None \| DiscardStrategy.Route \| DiscardStrategy.Video` | `DiscardStrategy.Route` |
| `load`             | `load`     | This is the topic this action-command is targeting.                                                         | `LoadStrategy.Load \| LoadStrategy.Play \| LoadStrategy.Queue`                                   | `LoadStrategy.Queue`    |
| `loop`             | `loop`     | Set this to true to have the audio file loop.                                                               | `boolean`                                                                                        | `false`                 |
| `src` _(required)_ | `src`      | The path to the audio-file.                                                                                 | `string`                                                                                         | `undefined`             |
| `track`            | `track`    | Set this attribute to have the audio file tracked in session effectively preventing it from playing again.. | `boolean`                                                                                        | `false`                 |
| `trackId`          | `track-id` | The identifier for this music track                                                                         | `string`                                                                                         | `undefined`             |


## Methods

### `getAction() => Promise<EventAction<AudioTrack>>`

Get the underlying actionEvent instance. Used by the x-action-activator element.

#### Returns

Type: `Promise<EventAction<AudioTrack>>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
