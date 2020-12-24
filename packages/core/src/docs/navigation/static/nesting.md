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
  
  
<x-link href="/navigation/static/nesting/deep"
  custom="button" anchor-class="btn btn-info text-white">
  <i class="ri-treasure-map-fill"></i>
  Click here to go deeper!
</x-link>