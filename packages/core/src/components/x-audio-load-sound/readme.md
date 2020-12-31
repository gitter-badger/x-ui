# X-AUDIO-LOAD-SOUND

This component declares audio used within this **`<x-view-do>`** route. The **`<x-audio-load-sound>`** represents audio files and play behaviors. They are all sent to the global-audio player to pre-load or play when the route is active. The player manages them according to their settings.  

## Usage

````html
<x-view-do>
  <x-audio-load-sound
    mode="queue|play|load"
    track-id="<unique-id>"
    src="<url>"    
    discard="route|video|next|none"
    track
    ></x-audio-load-sound>    
</x-view-do>
````

### Simple

````html
<x-view-do>
  <x-audio-load-sound   
    track-id="<unique-id>"
    src="<url>"></x-audio-load-sound>    
</x-view-do>
````

## Timed

For timed audio, the audio is sent up front for pre-loading. Then at the given time, a separate **`<x-audio-action>`** event is dispatched to play it at a given time. This way, the audio is likely to play on time without any buffering. 


The following demonstrates how to load a track, and wait 10 seconds until it plays. It's important to remember this time can be paused by the user, so it's could be any amount of time if a video is playing.

````html
<x-view-do>
  <x-audio-load-sound 
    track-id="audio1"
    src="<url>">
  </x-audio-load-sound>
  <x-action-activator
    activate="AtTime"
    time="10">
    <x-audio-action
      type="sound"
      command="start"
      track-id="audio1">
    </x-audio-action>
  </x-action-activator>
</x-view-do>
````




<!-- Auto Generated Below -->


## Properties

| Property               | Attribute  | Description                                                                                                 | Type                                                                                             | Default                 |
| ---------------------- | ---------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------- |
| `discard`              | `discard`  | The discard strategy the player should use for this file.                                                   | `DiscardStrategy.Next \| DiscardStrategy.None \| DiscardStrategy.Route \| DiscardStrategy.Video` | `DiscardStrategy.Video` |
| `mode`                 | `mode`     | This is the topic this action-command is targeting.                                                         | `LoadStrategy.Load \| LoadStrategy.Play \| LoadStrategy.Queue`                                   | `LoadStrategy.Load`     |
| `src` _(required)_     | `src`      | The path to the audio-file.                                                                                 | `string`                                                                                         | `undefined`             |
| `track`                | `track`    | Set this attribute to have the audio file tracked in session effectively preventing it from playing again.. | `boolean`                                                                                        | `false`                 |
| `trackId` _(required)_ | `track-id` | The identifier for this music track                                                                         | `string`                                                                                         | `undefined`             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
