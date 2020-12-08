# x-action-activator



<!-- Auto Generated Below -->


## Properties

| Property                | Attribute       | Description                                               | Type                                                                                                                                                                               | Default     |
| ----------------------- | --------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `activate` _(required)_ | `activate`      | The activation strategy to use for the contained actions. | `ActionActivationStrategy.onEnter \| ActionActivationStrategy.onEvent \| ActionActivationStrategy.onExit \| ActionActivationStrategy.onTime \| ActionActivationStrategy.onVisible` | `undefined` |
| `elementQuery`          | `element-query` | The element to watch for events or visibility,            | `string`                                                                                                                                                                           | `undefined` |
| `eventName`             | `event-name`    |                                                           | `string`                                                                                                                                                                           | `undefined` |
| `time`                  | `time`          |                                                           | `number`                                                                                                                                                                           | `undefined` |


## Events

| Event              | Description | Type                                                   |
| ------------------ | ----------- | ------------------------------------------------------ |
| `navigationEvents` |             | `CustomEvent<ActionEvent<NavigateTo \| NavigateNext>>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
