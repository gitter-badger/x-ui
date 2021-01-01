# Deep Nested Routing

Check out the source to see how this was done without JavaScript or a build-process.

````html
<x-view url="/routing" page-title="Routing System">
  <x-view url="/static"
    page-title="Static Demo">
    <x-view url="/deep"
      page-title="Deep Nesting">
      ... THIS PAGE ....
    </x-view>

    ... static routing content ...
  </x-view>
  ... routing content ...
</x-view>
````