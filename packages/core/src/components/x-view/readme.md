# X-VIEW Component

The View component is a child component for the **`<x-ui>`** component for adding a page-route. It is a container element that displays its inner HTML for a given route or sub-route. This provides a declarative mechanism for in-page content/component routing by URL. 

> ℹ️) This component enables single-page app functionality, with full path routing without scripting.

````html
<x-ui>
  <x-view url="/"
    page-title="Home"
    transition="fade-in"
    
    >    
    ...
  </x-view>
  <x-view url="/about"
    page-title="About Us"
    scroll-top-offset="20"
    >    
    ...
  </x-view>
</x-ui>
````

The View Component and its attributes provide the page context & functionality:

* Page title updates
* Scroll top on navigation
* Smooth transitions between routes
* Parameterized data for data-driven routing
* Page visit tracking
* Attribute-based conditional show/hide of child elements

### Child Views & Routing

Views can hold any HTML, including View components. This implicitly creates child routes below the path configured for this View.  This View will enforce the routing rule, by inserting its own path in the child-views path property (This should be done in a way that accounts for the parent path being included in the child path attribute)

````html
<x-ui>
  <x-view url="/">    
    ...
  </x-view>
  <x-view url="/about">    
    <x-view url="/location">    
      ...
    </x-view>
  </x-view>  
</x-ui>
````

### Child View-Dos

The contained HTML is parsed before rendering and special handling is given if any child elements are **`<x-view-do>`** elements. Before rendering its own HTML, this component iterates the collection and evaluates their conditions (_when_ attribute) looking for the first **`<x-view-do>`** that should be displayed, using the order they are declared. If and when a non-visited **`<x-view-do>`** is found, its route is activated and subsequently marked as visited. 

**`<x-view-do>`** components each have their own **visit** strategies, but each of them need only return to their parent URL when completed. The parent performs the above evaluation until each child **`<x-view-do>`** element has been visited or is excluded by its rule  (_when_ attribute).  

At that point, the inner HTML content is finally revealed. Using this convention, you can declaratively create a workflow of pages that must be visited to reach a destination.

### Child Attribute Detection & Resolution

The following attributes are queried to resolve certain data-values or show/hide conditions for all child elements. 

#### Hide When:  [x-hide-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if TRUE, the element is hidden. This evaluation occurs whenever data-changes.

````html
<any x-hide-when="predicate" />
````

#### Show When:  [x-show-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if FALSE, the element is shown. This evaluation occurs whenever data-changes. 

````html
<any x-show-when="predicate" hidden/>
````

> ℹ️) To initially hide the element, be sure to include the ‘hidden’ attribute.


<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description                                                                       | Type      | Default     |
| ------------------ | ------------------- | --------------------------------------------------------------------------------- | --------- | ----------- |
| `contentSrc`       | `content-src`       | Remote URL for this Route's content.                                              | `string`  | `undefined` |
| `debug`            | `debug`             | Turn on debug statements for load, update and render events.                      | `boolean` | `false`     |
| `pageTitle`        | `page-title`        | The title for this view. This is prefixed before the app title configured in x-ui | `string`  | `''`        |
| `scrollTopOffset`  | `scroll-top-offset` | Header height or offset for scroll-top on this view.                              | `number`  | `undefined` |
| `transition`       | `transition`        | Navigation transition between routes. This is a CSS animation class.              | `string`  | `undefined` |
| `url` _(required)_ | `url`               | The url for this route, including the parent's routes.                            | `string`  | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
