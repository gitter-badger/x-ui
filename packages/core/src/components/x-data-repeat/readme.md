# X-DATA-REPEAT

This tag renders a template for each item in the configured array. The item template uses value expressions to insert data from any [data provider](/data/providers) as well as the item in the array.

## Usage

````html
<x-data-repeat items="{expression}">
  <template>
    <div>{data}</div>
  </template>
</x-data-repeat>
````
The **items** attribute can be any array-string or an [expression](/data/expressions) to pull data from a registered provider.


### Declarative Items Source

This component supports a three ways to express the collection or where it comes from.

#### Items from Attribute (Simple Array)

````html
<x-data-repeat items="['one','two','three']">
  <template>
    <div>{data:item}</div>
  </template>
</x-data-repeat>
````

#### Items from Attribute (Provider Array)

````html
<x-data-repeat items="{storage:cart-items}">
  <template>
    <div>{data:productName}</div>
  </template>
</x-data-repeat>
````

#### Items from Inline Script (Object Array)

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

#### Items from Remote URL (Remote Array)

````html
<x-data-repeat items-src="/data/items.json">
  <template>
    <div style="color: {data:color};">{data:name}</div>
  </template>
</x-data-repeat>
````

### Template Interpolation

This component supports HTML string interpolation within a child template tag. Each item from the configured collection will be rendered with this template. 


**Data Token Format:** ````{<provider>:<data-key>(?<default>)} ````

**provider**: the data provider name
**data-key**: the data value key within the provider *
**default**: optional default value if the provider's key is empty.

\* _If there are any dots in the key, the evaluator attempts to parse the base value as JSON, then uses the dot-notation to select a value from the object. For example, the expression ````{data:user.name}```` means the session value 'user' is a JSON object, parse it and replace with the 'name' property._

> See [data expressions](/data/expressions) for full documentation

**Providers:**

* Browser Session: **session**
* Browser Storage: **storage**
* Cookies: **cookie**
* Route: **route**
* Query: **query**
* Data Item: **data**

> See [data providers](/data/providers) to learn how to add custom data providers.


<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                                                                                  | Type      | Default     |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------------------ | --------- | ----------- |
| `debug`    | `debug`     | Turn on debug statements for load, update and render events.                                                 | `boolean` | `false`     |
| `filter`   | `filter`    | The JSONata query to filter the json items see https://try.jsonata.org/ for more info.                       | `string`  | `undefined` |
| `items`    | `items`     | The array-string or data expression to obtain a collection for rendering the template.                       | `string`  | `undefined` |
| `itemsSrc` | `items-src` | The URL to remote JSON collection to use for the items.                                                      | `string`  | `undefined` |
| `noRender` | `no-render` | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute. | `boolean` | `false`     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
