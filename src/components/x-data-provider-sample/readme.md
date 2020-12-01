# x-data-provider-sample



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                                  | Type      | Default    |
| -------- | --------- | ------------------------------------------------------------ | --------- | ---------- |
| `debug`  | `debug`   | When debug is true, a reactive table of values is displayed. | `boolean` | `false`    |
| `name`   | `name`    | Customize the name used for this sample data provider.       | `string`  | `'memory'` |


## Events

| Event      | Description                                                                                                                                         | Type                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `register` | This event is raised when the component loads. The data-provider system should capture this event and register the provider for use in expressions. | `CustomEvent<ActionEvent<ProviderRegistration>>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
