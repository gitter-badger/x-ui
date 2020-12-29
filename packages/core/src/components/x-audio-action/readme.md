# x-audio-action



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
