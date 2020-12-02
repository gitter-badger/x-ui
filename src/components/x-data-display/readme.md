# x-data-display


Render text from data-providers directly to HTML using a declarative expression in the 'from' attribute. This element renders the expression with all data-tokens replaced with the values provided by the provider.

See [data expressions][data-expressions] for full documentation and how to add your own provider.

The expression can be any string with tokens from any registered provider.

**Data Token Format:** ````{<provider>:<data-key>(?<default>)} ````

**provider**: the data provider name
**data-key**: the data value key within the provider *
**default**: optional default value if the provider's key is empty.


\* _If there are any dots in the key, the evaluator attempts to parse the base value as JSON, then uses the dot-notation to select a value from the object. For example, the expression ````{session:user.name}```` means the session value 'user' is a JSON object, parse it and replace with the 'name' property._

Providers:
* Browser Session: **session**
* Browser Storage: **storage**
* Cookies: **cookie**


## Usage

### Simple Values

````html
<x-data-display
  expression="<any expression or value to render to the page>">
</x-data-display>
````

### Template Interpolation

This component supports HTML string interpolation in an Angular format, but the variables must be set on the element using data-* tags. The values get resolved, just like the expression. The values in the attributes replace the tokens in the content.

````html
<x-data-display data-name="{session:name}">    
  <template>
    <h1>Hello {{name}}!</h1>      
  </template>
</x-data-display>
````

[data-expressions]:[../data-expressions]

!> This component only supports template parsing with the <template> tag. Any other tag will not be interpreted. 

<!-- Auto Generated Below -->


## Properties

| Property            | Attribute | Description                                                                         | Type     | Default     |
| ------------------- | --------- | ----------------------------------------------------------------------------------- | -------- | ----------- |
| `class`             | `class`   | The data expression to obtain a value for rendering as inner-text for this element. | `string` | `null`      |
| `expression` _(required)_ | `expression`    | The data expression to obtain a value for rendering as inner-text for this element. | `string` | `undefined` |


## CSS Custom Properties

| Name          | Description                       |
| ------------- | --------------------------------- |
| `--x-display` | Display value for this component. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
