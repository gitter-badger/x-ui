# Navigation

## Static Navigation
Static routing is a lot like most in-page content routers. 

> Except this one doesn't require a build-process or JavaScript.

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
</x-ui>
````

<ion-item>
  <ion-icon slot="start" name="map"></ion-icon>
  <x-link href="/navigation/static">
    Static Routing
  </x-link>
</ion-item>

## Guided Navigation

Guided navigation is a convention-based approach to provide developers with a mechanism for presentation-based (next/back) navigation systems.


````html
<x-ui
  app-title=""
  transition="fade-in"
  start-url="/wizard"
  >
  <x-view url="/wizard"
    page-title="Follow this">

    <x-view-do url="/step-1"
      page-title="Step 1">
      ... step 1 ...
    </x-view-do>

    <x-view-do url="/step-2"
      page-title="Step 1">
      ... step 2 ...
    </x-view-do>

  ... complete content ...
  </x-view>
</x-ui>
````

<ion-item>
  <ion-icon slot="start" name="navigate-circle"></ion-icon>
  <x-link  href="/navigation/guided">
    Guided Navigation
  </x-link>
</ion-item>