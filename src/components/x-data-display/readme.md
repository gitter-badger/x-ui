# X-DATA-DISPLAY

Render data directly into HTML using declarative expressions. This element renders the expression with all data-tokens replaced with the values provided by the provider.

## Usage

### Simple Values

````html
<x-data-display
  text="{expression}">
</x-data-display>
````
The expression can be any string with tokens from any registered provider.


### Template Interpolation

This component supports HTML string interpolation within a child template tag. The values get resolved, just like the expression. The values in the attributes replace the tokens in the content.

````html
<x-data-display>
  <template>
    <h1>Hello {expression}!</h1>
  </template>
</x-data-display>
````

> This component only supports template interpolation within the **\<template\>** tag.

### Template Interpolation

This component supports HTML string interpolation within a child template tag. The values get resolved, just like the expression. The values in the attributes replace the tokens in the content.

````html
<x-data-display>    
  <template>
    <h1>Hello {session:name}!</h1>      
  </template>
</x-data-display>
````


**Data Token Format:** ````{<provider>:<data-key>(?<default>)} ````

**provider**: the data provider name
**data-key**: the data value key within the provider *
**default**: optional default value if the provider's key is empty.

> See [data expressions](/data/expressions) for full documentation


\* _If there are any dots in the key, the evaluator attempts to parse the base value as JSON, then uses the dot-notation to select a value from the object. For example, the expression ````{session:user.name}```` means the session value 'user' is a JSON object, parse it and replace with the 'name' property._

**Providers:**

* Browser Session: **session**
* Browser Storage: **storage**
* Cookies: **cookie**
* Route: **route**
* Query: **query**
* In-line: **data**

> See [data providers](/data/providers) to learn how to add custom data providers.


<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                                                                                  | Type      | Default     |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------------------ | --------- | ----------- |
| `noRender` | `no-render` | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute. | `boolean` | `false`     |
| `text`     | `text`      | The data expression to obtain a value for rendering as inner-text for this element.                          | `string`  | `undefined` |


## CSS Custom Properties

| Name          | Description                       |
| ------------- | --------------------------------- |
| `--x-display` | Display value for this component. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
