# Routing & Page Base x-ui

The root component is the base container for the view-engine and its child components.  This element should contain root-level HTML that is global to every view along with x-view components placed within any global-html.

````html
<x-ui
  app-title="view.DO Web Components"
  root-path=""
  transition="fade-in"
  audio
  analytics
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

<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description                                                                                                                  | Type                  | Default     |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `analytics`       | `analytics`         | When true, the analytics events are captured and delegated using Event Actions.                                              | `boolean`             | `undefined` |
| `appTitle`        | `app-title`         | This is the application / site title. If the views or dos have titles, this is added as a suffix.                            | `string`              | `undefined` |
| `audio`           | `audio`             | When true, the global audio component is loaded and subscribed for Event Action requests to play sounds.                     | `boolean`             | `undefined` |
| `fullPage`        | `full-page`         | Set this to false if you don't want the UI component to take up the full page size.   *                                      | `boolean`             | `true`      |
| `historyType`     | `history-type`      | Browser (paths) or Hash (#) routing. To support browser history, the HTTP server must be setup for a PWA                     | `"browser" \| "hash"` | `'browser'` |
| `root`            | `root`              | This is the root path that the actual page is, if it isn't '/', then the router needs to know where to begin creating paths. | `string`              | `'/'`       |
| `scrollTopOffset` | `scroll-top-offset` | Header height or offset for scroll-top on this and all views.                                                                | `number`              | `undefined` |
| `startUrl`        | `start-url`         | This is the start path a user should land on when they first land on this app.                                               | `string`              | `'/'`       |
| `transition`      | `transition`        | Navigation transition between routes. This is a CSS animation class.                                                         | `string`              | `'fade-in'` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
