# x-action



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                              | Type                                | Default     |
| --------- | --------- | -------------------------------------------------------- | ----------------------------------- | ----------- |
| `command` | `command` | The command to execute.                                  | `string`                            | `undefined` |
| `data`    | `data`    | The JSON serializable data payload the command requires. | `string`                            | `undefined` |
| `topic`   | `topic`   | This is the topic this action-command is targeting.      | `"data" \| "document" \| "routing"` | `undefined` |


## Methods

### `getAction() => Promise<ActionEvent<any>>`

Get the underlying actionEvent instance. Used by the x-action-activator element.

#### Returns

Type: `Promise<ActionEvent<any>>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
