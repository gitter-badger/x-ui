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

#### Special Next & Back Attributes
To make guided-navigation easy, you can add attributes to set-up event-handlers for next & back.

#### [x-next]

````html
<any x-next />
````

#### [x-back]

````html
<any x-back />
````



#### [x-hide-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if TRUE, the element is hidden. This evaluation occurs whenever data-changes.

````html
<any x-hide-when="predicate" />
````

#### [x-show-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if FALSE, the element is shown. This evaluation occurs whenever data-changes. 

````html
<any x-show-when="predicate" hidden/>
````

> ℹ️) To initially hide the element, be sure to include the ‘hidden’ attribute.

### Time-Presentation Child Attribute Resolution
The **\<x-view-do\>** element is always keeping track of time once its route is active. As such, you can create timed-based actions using special attributes placed on any child element.

> ℹ️) If a video element is detected, its time is used, allowing pause & play.

#### [x-in-time] & [x-in-class]
This attribute removes the 'hidden' attribute if present at the specified time in seconds.


````html
<any hidden x-in-time="1" />
````

> ℹ️) To initially hide the element, be sure to include the ‘hidden’ attribute.

When used with x-in-class, this attribute adds the specified class and removes the 'hidden' attribute if present at the specified time in seconds.

````html
<any hidden x-in-time="1" x-in-class="fade-in" />
````

####  [x-out-time] & [x-out-class]
This attribute adds the 'hidden' attribute if  no x-out-class attribute is present at the specified time in seconds. 

````html
<any x-out-time="1" />
````
> ℹ️) To initially hide the element, be sure to include the ‘hidden’ attribute.

When used with x-out-class, this attribute adds the specified class and removes the 'hidden' attribute if present at the specified time out seconds.

````html
<any x-out-time="1" x-out-class="fade-out" />
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
| `contentSrc`       | `content-src`       | Remote URL for this Route's content.                                                                                                                                                                                 | `string`                                                               | `undefined`          |
| `debug`            | `debug`             | To debug timed elements, set this value to true.                                                                                                                                                                     | `boolean`                                                              | `false`              |
| `duration`         | `duration`          | Set a duration in milliseconds for this view. When this value exists, the page will automatically progress when the duration in seconds has passed.                                                                  | `number`                                                               | `undefined`          |
| `pageTitle`        | `page-title`        | The title for this view. This is prefixed before the app title configured in x-ui                                                                                                                                    | `string`                                                               | `''`                 |
| `scrollTopOffset`  | `scroll-top-offset` | Header height or offset for scroll-top on this view.                                                                                                                                                                 | `number`                                                               | `undefined`          |
| `transition`       | `transition`        | Navigation transition between routes. This is a CSS animation class.                                                                                                                                                 | `string`                                                               | `undefined`          |
| `url` _(required)_ | `url`               | The url for this route, including the parent's routes.                                                                                                                                                               | `string`                                                               | `undefined`          |
| `visit`            | `visit`             | The visit strategy for this do. once: persist the visit and never force it again always: do not persist, but don't don't show again in-session optional: do not force this view-do ever. It will be available by URL | `VisitStrategy.always \| VisitStrategy.once \| VisitStrategy.optional` | `VisitStrategy.once` |
| `when`             | `when`              | If present, the expression must evaluate to true for this route to be sequenced by the parent view. The existence of this value overrides the visit strategy                                                         | `string`                                                               | `undefined`          |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
