# x-action-activator



<!-- Auto Generated Below -->


## Properties

| Property                | Attribute       | Description                                               | Type                                                                                                                                                                                    | Default     |
| ----------------------- | --------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `activate` _(required)_ | `activate`      | The activation strategy to use for the contained actions. | `ActionActivationStrategy.AtTime \| ActionActivationStrategy.OnElementEvent \| ActionActivationStrategy.OnEnter \| ActionActivationStrategy.OnEvent \| ActionActivationStrategy.OnExit` | `undefined` |
| `elementQuery`          | `element-query` | The element to watch for events or visibility,            | `string`                                                                                                                                                                                | `undefined` |
| `eventName`             | `event-name`    |                                                           | `string`                                                                                                                                                                                | `undefined` |
| `time`                  | `time`          |                                                           | `number`                                                                                                                                                                                | `undefined` |


## Methods

### `activateActions() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
