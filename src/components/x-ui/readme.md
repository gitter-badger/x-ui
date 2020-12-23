# X-UI Component
The root component is the base container for the view-engine and its child components.  This element should contain root-level HTML that is global to every view along with x-view components placed within any global-html.

## Routing


````html
<x-ui
  app-title="view.DO Web Components"
  history-type="browser|hash"
  scroll-top-offset="0"
  transition="fade-in"
  full-page="false"
  start-url="/"
  root=""
  debug
  audio
  >
  ...
  <x-view ...></x-view>
  <x-view ...></x-view>
  ...
</x-ui>
````
This is where routing is established and the start path is configured. 

It provides an entry-point for the guided-navigation system.

**Responsibilities:**
* Content navigation settings & control actions
* Document actions
* Audio preference management & control actions

> If you want to have a special page for routes that are not resolved. Add a single **\<x-view\>**, with **url="*"**.




<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description                                                                                                                  | Type                  | Default     |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `appTitle`        | `app-title`         | This is the application / site title. If the views or dos have titles, this is added as a suffix.                            | `string`              | `undefined` |
| `debug`           | `debug`             | Turn on debugging to get helpful messages from the routing, data and action systems.                                         | `boolean`             | `false`     |
| `fullPage`        | `full-page`         | Set this to false if you don't want the UI component to take up the full page size.   *                                      | `boolean`             | `true`      |
| `historyType`     | `history-type`      | Browser (paths) or Hash (#) routing. To support browser history, the HTTP server must be setup for a PWA                     | `"browser" \| "hash"` | `'browser'` |
| `root`            | `root`              | This is the root path that the actual page is, if it isn't '/', then the router needs to know where to begin creating paths. | `string`              | `'/'`       |
| `scrollTopOffset` | `scroll-top-offset` | Header height or offset for scroll-top on this and all views.                                                                | `number`              | `undefined` |
| `startUrl`        | `start-url`         | This is the start path a user should land on when they first land on this app.                                               | `string`              | `'/'`       |
| `transition`      | `transition`        | Navigation transition between routes. This is a CSS animation class.                                                         | `string`              | `'fade-in'` |


## Events

| Event          | Description                    | Type               |
| -------------- | ------------------------------ | ------------------ |
| `innerEvents`  | Listen to all XUI events here. | `CustomEvent<any>` |
| `routeChanged` | Listen to all XUI events here. | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
