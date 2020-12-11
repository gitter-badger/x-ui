# X-VIEW / X-VIEW-DO

This component is a child of the <x-view> component that turns HTML into a slide-like presentation. The parent displays <view-do> items, one at a time in sequence until they have all been visited, conditionally skipped, or completed. 

````html
<x-view-do url="/confirm-age"
  when="{storage:age} == null"
  >
  ...
</x-view-do>
````

Presentation Routes:
* Are only valid within a parent x-view component.
* Are always sub-routes of the parent’s path.
* Contain & activate ONE child x-video component.
* Contain & activate audio control x-audio-controls components.
* Activates entry action control components on entry.
* Keeps track of the time since entry and activates timed action control components at their configured time.
* Activates exit action control components on exit.
* Automatically attaches Next() and Back() handlers to elements with classes.
This component can be configured with a “when” attribute, that declares an expression to determine if this component is supposed to be viewed or not. 

### Routing & Guided Navigation

This evaluation has to take place before the route is activated as the underlying data can change in the previous Do components.  If the component is deemed unnecessary (the predicate returns false), the component marks itself ‘complete’ and returns control to the parent view, without revealing its contents.

### Child Attribute Detection & Resolution

The following attributes are queried to resolve certain data-values or show/hide conditions for all child elements. 

#### Next:  .x-next

````html
<any class=".x-next" />
````

#### Back:  .x-back

````html
<any class=".x-back" />
````

#### Hide When:  [hide-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if TRUE, the element is hidden. This evaluation occurs whenever data-changes.

````html
<any hide-when="predicate" />
````

#### Show When:  [show-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if FALSE, the element is shown. This evaluation occurs whenever data-changes. 

````html
<any show-when="predicate" hidden/>
````

> ℹ️) To initially hide the element, be sure to include the ‘hidden’ attribute.

#### In Time:  [x-in-time]

````html
<any x-in-time="1" />
````

> ℹ️) To initially hide the element, be sure to include the ‘hidden’ attribute.

#### In Class:  [x-in-class]

````html
<any x-in-class="fade-in" />
````
#### Out Time:  [x-out-time]

````html
<any x-out-time="1" />
````

#### Out Class:  [x-out-class]

````html
<any x-out-class="fade-in" />
````

#### Time To:  [x-time-to]
This attribute instructs **\<x-view-do\>** to inject the current time to the named attributes. In this example's case 'value' will be updated.

````html
<any value="" x-time-to="value" />
````

#### Time Percentage To: [x-percentage-to]
This attribute instructs **\<x-view-do\>** to inject the current time percentage (based on the **next-after** attribute or the video-duration) to the named attributes. In this example's case 'value' will be updated.

````html
<any value="" x-percentage-to="value" />
````

<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description                                                                                                                                                                                                          | Type                                                                   | Default              |
| ------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------- |
| `pageTitle`        | `page-title`        | The title for this view. This is prefixed before the app title configured in x-ui                                                                                                                                    | `string`                                                               | `''`                 |
| `scrollTopOffset`  | `scroll-top-offset` | Header height or offset for scroll-top on this view.                                                                                                                                                                 | `number`                                                               | `undefined`          |
| `transition`       | `transition`        | Navigation transition between routes. This is a CSS animation class.                                                                                                                                                 | `string`                                                               | `undefined`          |
| `url` _(required)_ | `url`               | The url for this route, including the parent's routes.                                                                                                                                                               | `string`                                                               | `undefined`          |
| `visit`            | `visit`             | The visit strategy for this do. once: persist the visit and never force it again always: do not persist, but don't don't show again in-session optional: do not force this view-do ever. It will be available by URL | `VisitStrategy.always \| VisitStrategy.once \| VisitStrategy.optional` | `VisitStrategy.once` |
| `visited`          | `visited`           | A property that returns true if this route has already been visited. This will be used by the parent view to determine if this route should be part of a sequence.                                                   | `boolean`                                                              | `false`              |
| `when`             | `when`              | If present, the expression must evaluate to true for this route to be sequenced by the parent view. The existence of this value overrides the visit strategy                                                         | `string`                                                               | `undefined`          |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
