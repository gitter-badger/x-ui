### Nested Routes

Nested routes are just as easy. You can next **`<x-view>`** elements and have the path automatically inherit the parent **`<x-view>`** or you can just declare a deep path and provide a way to get there.

#### Flat Declaration

````html
  <x-view url="/home"
    page-title="Home">
  ... home content ...
  </x-view>

  <x-view url="/home/about"
    page-title="About">
  ... about content ...
  </x-view>
````

#### Nested Declaration

````html
  <x-view url="/home"
    page-title="Home">
    <x-view url="/about"
      page-title="About">
    ... about content ...
    </x-view>
  ... home content ...
  </x-view>
````
  
<ion-item>
  <ion-icon slot="start" name="trending-down-outline"></ion-icon>
  <x-link href="/navigation/static/nesting/deep">
    Click here to go deeper!
  </x-link>
</ion-item>