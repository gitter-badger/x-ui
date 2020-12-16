# Element Event Actions

Element-event actions work using by attaching an event-listener to the specified element/s. 

> You will get an alert when you click the button.

````html
<x-view-do url="/elements"
  visit="optional">
  <x-action-activator
    activate="OnElementEvent"
    element-query="#button1"
    event-name="click">
    <x-action
      topic="document"
      command="alert"
      data='{"message": "You clicked it!"}'></x-action>
  </x-action-activator>
  ... content ...
</x-view-do>
````
