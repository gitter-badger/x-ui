
---

## Now that it's installed...
Just add the [**`<x-ui>`**](/documentation/components/x-ui) tag to your page.

````html
<x-ui
  app-title="My HTML App"
  transition="fade-in"
  start-url="/page-1">
  <x-view url="/page-1" page-title="Page 1">
    <h1>Hello World!</h1>
    <h2>Now you have a basic content router.</h2>
    <p>
      It's a good idea to include the main page contents in-line for
      ultra-fast rendering.
    </p>
    <p>
      To keep the initial size lightweight, retrieve additional 
      pages on-demand by using the <b>content-src=""</b> attribute 
      of the &lt;x-view&gt; component.
    </p>
  </x-view>
  <x-view url="/page-2" page-title="Page 2"
    content-src="/pages/page-2">
  </x-view>
</x-ui>
````