# Deep Nested Routing

Check out the source to see how this was done without JavaScript or a build-process.

````html
<x-view url="/navigation" page-title="Navigation System">
  <x-view url="/static"
    page-title="Static Demo">
    <x-view url="/deep"
      page-title="Deep Nesting">
      ... THIS PAGE ....
    </x-view>

    ... static navigation content ...
  </x-view>
  ... navigation content ...
</x-view>
````