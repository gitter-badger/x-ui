# x-data-show

This tag conditionally renders child elements based on the configured predicate applied to the value expression.

````html
<x-show when="<expression>">
 ... contents ...
</x-show>
````

<!-- Auto Generated Below -->


## Properties

| Property            | Attribute | Description                                                                                               | Type     | Default     |
| ------------------- | --------- | --------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `when` _(required)_ | `when`    | The data expression to obtain a predicate for conditionally rendering the inner-contents of this element. | `string` | `undefined` |


## CSS Custom Properties

| Name          | Description                       |
| ------------- | --------------------------------- |
| `--x-display` | Display value for this component. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*