# X-ACTION-ACTIVATOR

This element defines how and when a group of Actions, defined with the **\<x-action\>** element, are submitted to the [Action Bus](/actions/bus).

## Usage

This element should only ever contain child  **`<x-action>`** tags. The attributes tells the parent The parent tag defines how and when the child actions are submitted to the [Action Bus](/actions/bus).


````html
<x-action-activator
  activate="<activation-strategy>"
  ... supporting attributes ...
  >
  <x-action ...></x-action>
  <x-action ...></x-action>
  <x-action ...></x-action>
</x-action-activator>
````

### Activation Strategies
The **activate** attribute define the strategy for activating all child actions, in the order they appear.

#### OnEnter
The **OnEnter** activation-strategy only works when this element is a child of **\<x-view-do\>**. The child actions will fire when the parent route is activated and the contents are displayed.

````html
<x-view-do ...>
  <x-action-activator
    activate="OnEnter"
    >
    <x-action ...></x-action>
    <x-action ...></x-action>
    <x-action ...></x-action>
  </x-action-activator>
</x-view-do>
````

### OnExit
The **OnEnter** activation-strategy only works when this element is a child of **\<x-view-do\>**. The child actions will fire when the parent route is de-activated and the next route is displayed.

````html
<x-view-do ...>
  <x-action-activator
    activate="OnExit"
    >
    <x-action ...></x-action>
    <x-action ...></x-action>
    <x-action ...></x-action>
  </x-action-activator>
</x-view-do>
````

### AtTime
The **AtTime** activation-strategy only work when this element is a child of **\<x-view-do\>**. The child actions will fire when the parent route has been activated for the given time within the **time** attribute.


````html
<x-view-do ...>
  <x-action-activator
    activate="AtTime"
    time="3"
    >
    <x-action ...></x-action>
    <x-action ...></x-action>
    <x-action ...></x-action>
  </x-action-activator>
</x-view-do>
````

### OnElementEvent

The **OnElementEvent** activation-strategy can be used anywhere within the **\<x-ui\>** container. The child actions will fire when the target element raises the target event. 

````html
<x-action-activator
  activate="OnElementEvent"
  target-element="#submit"
  target-event="click"
  >
  <x-action ...></x-action>
  <x-action ...></x-action>
  <x-action ...></x-action>
</x-action-activator>
````

````html
<x-action-activator
  activate="OnElementEvent"
  target-event="click"
  >
  <x-action ...></x-action>
  <x-action ...></x-action>
  <x-action ...></x-action>
  <button>Click Me</button>
</x-action-activator>
````

<!-- Auto Generated Below -->


## Properties

| Property                | Attribute        | Description                                                                                                                                                                                                     | Type                                                                                                                                                | Default     |
| ----------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `activate` _(required)_ | `activate`       | The activation strategy to use for the contained actions.                                                                                                                                                       | `ActionActivationStrategy.AtTime \| ActionActivationStrategy.OnElementEvent \| ActionActivationStrategy.OnEnter \| ActionActivationStrategy.OnExit` | `undefined` |
| `debug`                 | `debug`          | Turn on debug statements for load, update and render events.                                                                                                                                                    | `boolean`                                                                                                                                           | `false`     |
| `targetElement`         | `target-element` | The element to watch for events when using the OnElementEvent activation strategy. This element uses the HTML Element querySelector function to find the element.  For use with activate="OnElementEvent" Only! | `string`                                                                                                                                            | `undefined` |
| `targetEvent`           | `target-event`   | This is the name of the event to listen to on the target element.                                                                                                                                               | `string`                                                                                                                                            | `'click'`   |
| `time`                  | `time`           | The time, in seconds at which the contained actions should be submitted.  For use with activate="AtTime" Only!                                                                                                  | `number`                                                                                                                                            | `undefined` |


## Methods

### `activateActions() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
