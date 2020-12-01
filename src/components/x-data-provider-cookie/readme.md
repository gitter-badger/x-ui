# x-data-provider-cookie



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                             | Type      | Default     |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `hideWhen`    | `hide-when`    | An expression that tells this component how to determine if the user has previously consented.          | `string`  | `undefined` |
| `skipConsent` | `skip-consent` | When skipConsent is true, the accept-cookies banner will not be displayed before accessing cookie-data. | `boolean` | `false`     |


## Events

| Event        | Description                                                                                                                                                                                | Type                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `didConsent` | This event is raised when the component loads. The data-provider system should capture this event and register the provider for use in expressions.                                        | `CustomEvent<ActionEvent<CookieConsent>>`        |
| `register`   | This event is raised when the component obtains consent from the user to use cookies. The data-provider system should capture this event and register the provider for use in expressions. | `CustomEvent<ActionEvent<ProviderRegistration>>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
