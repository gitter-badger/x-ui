# X-DATA-REPEAT

This tag renders a collection of data-values, using a template for each item. The item template uses value expressions to insert data.

## Usage

````html
<x-data-repeat items="{expression}">
  <template>
    <div>{data}</div>
  </template>
</x-data-repeat>
````
The **expression** can be any array-string or an expression to pull data from a registered provider.


### Template Interpolation

This component supports HTML string interpolation within a child template tag. The values get resolved, just like the expression. The values in the attributes replace the tokens in the content.

````html
<x-data-repeat>
  <script type="application/json">
    [
      { "color":"blue", "name":"Bob" },
      { "color":"red", "name":"Sally" }
    ]
  </script>  
  <template>
    <div style="color: {data:color};">{data:name}</div>
  </template>
</x-data-repeat>
````


**Data Token Format:** ````{<provider>:<data-key>(?<default>)} ````

**provider**: the data provider name
**data-key**: the data value key within the provider *
**default**: optional default value if the provider's key is empty.

\* _If there are any dots in the key, the evaluator attempts to parse the base value as JSON, then uses the dot-notation to select a value from the object. For example, the expression ````{session:user.name}```` means the session value 'user' is a JSON object, parse it and replace with the 'name' property._

> See [data expressions](/data/expressions) for full documentation

**Providers:**

* Browser Session: **session**
* Browser Storage: **storage**
* Cookies: **cookie**
* Route: **route**
* Query: **query**
* Inline Data Item: **data**

> See [data providers](/data/providers) to learn how to add custom data providers.


<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                                                                                  | Type      | Default     |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------------------ | --------- | ----------- |
| `items`    | `items`     | The array-string or data expression to obtain a collection for rendering the template.                       | `string`  | `undefined` |
| `noRender` | `no-render` | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute. | `boolean` | `false`     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
