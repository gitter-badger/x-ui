# X-AUDIO-LOAD-MUSIC

This component declares audio used within this **`<x-view-do>`** route. The **`<x-audio-load-music>`** represents audio files and play behaviors. They are all sent to the global-audio player to pre-load or play when the route is active. The player manages them according to their settings. 

## Usage

````html
<x-view-do>
  <x-audio-load-music
    mode="queue|play|load"
    track-id="<unique-id>"
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
    track-id="<unique-id>"
    src="<url>"></x-audio-load-music>
    
</x-view-do>
````


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

<!-- Auto Generated Below -->


## Properties

| Property           | Attribute  | Description                                                                                                 | Type                                                                    | Default                 |
| ------------------ | ---------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------- |
| `discard`          | `discard`  | The discard strategy the player should use for this file.                                                   | `DiscardStrategy.Next \| DiscardStrategy.None \| DiscardStrategy.Route` | `DiscardStrategy.Route` |
| `loop`             | `loop`     | Set this to true to have the audio file loop.                                                               | `boolean`                                                               | `false`                 |
| `mode`             | `mode`     | This is the topic this action-command is targeting.                                                         | `LoadStrategy.Load \| LoadStrategy.Play \| LoadStrategy.Queue`          | `LoadStrategy.Queue`    |
| `src` _(required)_ | `src`      | The path to the audio-file.                                                                                 | `string`                                                                | `undefined`             |
| `track`            | `track`    | Set this attribute to have the audio file tracked in session effectively preventing it from playing again.. | `boolean`                                                               | `false`                 |
| `trackId`          | `track-id` | The identifier for this music track                                                                         | `string`                                                                | `undefined`             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
