# Routing

Content routing uses a simple declarative approach to create multi-page apps from a single HTML file. By wrapping content in an  [**`<x-view>`**](/components/x-view) or [**`<x-view-do>`**](/components/x-view-do) element and setting the url, the contained-content won't be displayed until the URL path matches the path set in the **url** attribute.


````html
<x-view url="/home"
  page-title="Home">
  ... child-routes ...
  ... home content ...
</x-view>
````

**Remote Content** 
````html
<x-view url="/home"
  page-title="Home"
  content-src="/pages/home/index.html">
  ... child-routes ...
</x-view>
````

#### Nested Routes

Routes can contain child-routes to semantically express nested content using HTML.

<x-link href="/navigation/static/nesting"
  custom="button" anchor-class="btn btn-info text-white " >
  <i class="ri-treasure-map-fill"></i>
  Go Deeper on Nested Routes
</x-link>

#### Data Routes

Routes can express dynamic parameters, to provide data-driven views. You can even use that data in your HTML, again with no code.
  
<x-link href="/navigation/static/data"
  custom="button" anchor-class="btn btn-info text-white " >
  <i class="ri-space-ship-line"></i>
  Using Data Routes
</x-link>