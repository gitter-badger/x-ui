# X-AUDIO-LOAD-SOUND

This component declares the payload for a given Event Action to be submitted to the bus upon route activation. All **`x-audio`** elements are sent to the player when the route is active and the player manages them according to their settings.  

## Usage

````html
<x-view-do>
  <x-audio-load-sound
    action="queue|play|hold"
    id="<unique-id>"
    src="<url>"    
    discard="route|video|next|none"
    loop
    track></x-audio-load-sound>
    
</x-view-do>
````

### Simple

````html
<x-view-do>
  <x-audio
    type="ambient|voice"
    id="<unique-id>"
    src="<url>"></x-audio>
    
</x-view-do>
````

## Timed

For timed audio, the audio is sent up front for pre-loading. Then at the given time, a separate **`x-action`** event is dispatched to play it at a given time. This way, the audio is likely to play on time without any buffering. 


The following demonstrates how to load a track, and wait 10 seconds until it plays. It's important to remember this time can be paused by the user, so it's could be any amount of time if a video is playing.

````html
<x-view-do>
  <x-audio
    action="hold"
    type="voice"
    id="audio1"
    src="<url>">
  </x-audio>
  <x-action-activator
    activate="AtTime"
    time="10">
    <x-action
      topic="audio"
      command="start"
      data='{"id": "audio1"}'>
    </x-action>
  </x-action-activator>
</x-view-do>
````




<!-- Auto Generated Below -->


## Properties

| Property           | Attribute | Description                                                                                                 | Type                                                                                             | Default                 |
| ------------------ | --------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------- |
| `discard`          | `discard` | The discard strategy the player should use for this file.                                                   | `DiscardStrategy.Next \| DiscardStrategy.None \| DiscardStrategy.Route \| DiscardStrategy.Video` | `DiscardStrategy.Route` |
| `id`               | `id`      | The identifier for this music track                                                                         | `string`                                                                                         | `undefined`             |
| `load`             | `load`    | This is the topic this action-command is targeting.                                                         | `LoadStrategy.Load \| LoadStrategy.Play \| LoadStrategy.Queue`                                   | `LoadStrategy.Queue`    |
| `src` _(required)_ | `src`     | The path to the audio-file.                                                                                 | `string`                                                                                         | `undefined`             |
| `track`            | `track`   | Set this attribute to have the audio file tracked in session effectively preventing it from playing again.. | `boolean`                                                                                        | `false`                 |


## Methods

### `getAction() => Promise<ActionEvent<AudioTrack>>`

Get the underlying actionEvent instance. Used by the x-action-activator element.

#### Returns

Type: `Promise<ActionEvent<AudioTrack>>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
