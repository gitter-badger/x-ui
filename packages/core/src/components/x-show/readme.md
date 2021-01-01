# X-SHOW

This tag conditionally renders child elements based on the configured predicate applied to the when value predicate. To learn more about predicates, check out the [expressions](/data/expressions) documentation.

## Usage
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


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
