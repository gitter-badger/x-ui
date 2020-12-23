# Data Routes

Data routes are configured by using special expressions in the URL attribute.


````html
<x-view url="/data"
  page-title="Data List">

  <x-view url="/:item"
    page-title="{route:item} Details">
    ... content ...
    <x-display text="{route:item}"></x-display>
  </x-view>

  <x-link href="/navigation/static/data/pizza">Pizza</x-link>
  <x-link href="/navigation/static/data/wine">Wine</x-link>
</x-view>
  
````
  

### Select a Dynamic Route