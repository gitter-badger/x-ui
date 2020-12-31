# X-UI

The root component is the base container for the view-engine and its child components.  This element should contain root-level HTML that is global to every view along with x-view components placed within any global-html.

## Usage

````html
<x-ui
  app-title="view.DO Web Components"
  history-type="browser|hash"
  scroll-top-offset="0"
  transition="fade-in"
  full-page="false"
  start-url="/"
  root=""
  debug>
  ...
  <x-view ...></x-view>
  <x-view ...></x-view>
  ...
</x-ui>
````

## Routing

This component is the root container for all routing. It provides an entry-point for the content-routing.

**Responsibilities:**
* Content navigation settings
* Event Action Listener Registrations 
* Event Action event delegation to and from the bus
* Page title

> If you want to have a special page for routes that are not resolved. Add a route wildcard route as the last route **`<x-view url="*">`**.


For more information on routing, check out the [documentation](/routing). Also, check out the documentation for [**`<x-view>`**](/components/x-view) and [**`<x-view-do>`**](/components/x-view-do) components






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

| Event          | Description                      | Type               |
| -------------- | -------------------------------- | ------------------ |
| `action`       | Listen to all X-UI actions here. | `CustomEvent<any>` |
| `routeChanged` | Listen to all X-UI events here.  | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
