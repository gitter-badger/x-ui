# x-view-do



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description                                                                                                                                                                                                          | Type                                                                   | Default              |
| ------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------- |
| `pageTitle`        | `page-title`        | The title for this view. This is prefixed before the app title configured in x-ui                                                                                                                                    | `string`                                                               | `''`                 |
| `scrollTopOffset`  | `scroll-top-offset` | Header height or offset for scroll-top on this view.                                                                                                                                                                 | `number`                                                               | `undefined`          |
| `transition`       | `transition`        | Navigation transition between routes. This is a CSS animation class.                                                                                                                                                 | `string`                                                               | `undefined`          |
| `url` _(required)_ | `url`               | The url for this route, including the parent's routes.                                                                                                                                                               | `string`                                                               | `undefined`          |
| `visit`            | `visit`             | The visit strategy for this do. once: persist the visit and never force it again always: do not persist, but don't don't show again in-session optional: do not force this view-do ever. It will be available by URL | `VisitStrategy.always \| VisitStrategy.once \| VisitStrategy.optional` | `VisitStrategy.once` |
| `visited`          | `visited`           | A property that returns true if this route has already been visited. This will be used by the parent view to determine if this route should be part of a sequence.                                                   | `boolean`                                                              | `false`              |
| `when`             | `when`              | If present, the expression must evaluate to true for this route to be sequenced by the parent view. The existence of this value overrides the visit strategy                                                         | `string`                                                               | `undefined`          |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
