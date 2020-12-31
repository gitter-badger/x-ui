# x-audio-action

This element holds the data that __is__ the Event Action submitted to the [Action Bus](/actions).

## Usage

This element should only ever exists within a parent [**`<x-action-activator>`**](/components/x-action-activator) tag. The parent tag defines how and when the child actions are submitted to the [Event Action](/actions) bus.


````html
<x-action-activator ...>
  <x-audio-action
    type="music|sound"
    command="<command>"
    track-id="<id>"
    value="<value>"></x-audio-action>
</x-action-activator>
````

<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description                        | Type                                                             | Default           |
| --------- | ---------- | ---------------------------------- | ---------------------------------------------------------------- | ----------------- |
| `command` | `command`  | The command to execute.            | `"mute" \| "pause" \| "resume" \| "seek" \| "start" \| "volume"` | `undefined`       |
| `trackId` | `track-id` | The track to target.               | `string`                                                         | `undefined`       |
| `type`    | `type`     | The track to target.               | `AudioType.Music \| AudioType.Sound`                             | `AudioType.Sound` |
| `value`   | `value`    | The value payload for the command. | `boolean \| number \| string`                                    | `undefined`       |


## Methods

### `getAction() => Promise<EventAction<any>>`

Get the underlying actionEvent instance. Used by the x-action-activator element.

#### Returns

Type: `Promise<EventAction<any>>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
