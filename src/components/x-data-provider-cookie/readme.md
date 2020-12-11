# x-data-provider-cookie

## Cookie Data Provider Registration Component

This component enabled the **Cookie Data Provider**.

This store is long-lived from the same browser, but for very small data items. This provider enables you to use cookie data in your HTML.

Provider Key: '**cookie**'

 ```{cookie:(key)} ```

When included on the page, this component automatically shows a banner to collect consent from the user with an 'Accept' button.

```html
<x-data-provider-cookie>
  <p>Cookies help us track your every move.</p>
</x-data-provider-cookie>

````

> The HTML inside the element is shown directly on the banner. Use it to display your terms, privacy policy and explanation for using the cookie.


Alternatively, you can skip this by including the 'skip-consent' attribute.

```html
<x-data-provider--cookie skip-consent></x-data-provider--cookie>
````


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
