# Static Routing

Static content routing is possible using a simple, declarative approach.

This ```x-view``` element declares a route using its 'url' attribute. Because it's nested within another route, the URL '/navigation/static' presents this content.

````html
<x-ui
  app-title=""
  transition="fade-in"
  start-url="/home"
  >
  <x-view url="/home"
    page-title="Home">
  ... home content ...
  </x-view>

  <x-view url="/about"
    page-title="About">
  ... about content ...
  </x-view>

</x-ui>
````

### Nested Routes
Nested routes are as easy as nesting ```x-view``` elements.

<ion-item>
  <ion-icon slot="start" name="trending-down-outline"></ion-icon>
  <x-link href="/navigation/static/deep">
    Click here to go deeper.
  </x-link>
</ion-item>