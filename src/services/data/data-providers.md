# Data Providers

> The Data Provider system is a way to normalize data access for use within  Data Expressions. 

Data Providers _provide_ the underlying data-store for expressions to resolve using data from a variety of sources. Also, since custom providers can be added, you can extend your HTML with customizations, personalization and route-conditions with ANY data-set.

**Expression Format:** ```{ provider : key ? default } ```
The provider is the name of the store and the key is the data-item key. There is an option 'default' value that can be provided after a question-mark.

**Example:**
````
{storage:name?Friend}
````

## Built-in Data Providers
There are data-providers already created for sessionStorage, localStorage and cookies. The first two automatically are registered. The cookie provider is optional.

#### Session Storage
This store is short-lived and used to track 'session visits' and other temporary values. 

Provider Key: '**session**'

 ```{session:(key)} ```

#### Local Storage
This store is long-lived from the same browser.  and used to track 'session visits' and other temporary values. 

Provider Key: '**storage**'

 ```{storage:(key)} ```

#### Cookie Storage
This store is long-lived from the same browser, but for very small data items.

Provider Key: '**cookie**'

 ```{cookie:(key)} ```

The cookie provider is registered using a special component **<x-data-provider-cookie>**. 


## Custom Data Providers
You can extend this system by adding your own provider, using a Data Provider Event Action.

The system listens for custom events in the data topic: **xui:action-events:data**

To register a provider, provide a unique name and an instance that implements IDataProvider and that data will become available within the expression system.

**Custom Event to Register a Provider:**

````json
CustomEvent {
  event: "xui:action-events:data"
  detail: {
    command: "register-provider",
    data: {
      name: "myprovider",
      provider: providerInstance
    }
  }
}
````

Then, assuming your instance has a data item with key **name**, your HTML can use this value in an the expression: ```{myprovider:name}```


**Data Provider Interface:**

    get(key:string) : Promise<string>
    set(key: string, value: string) : Promise<void>
    changed: EventEmitter<string> [data-changed]

### Data Changed Event
To notify the system that your underlying data has changed, the interface includes a simple event emitter. Emit 'data-changed' from your __changed__ emitter and all components using your value will re-render with the new data value.

### Sample Data Provider

````typescript
import { DATA_EVENTS, IDataProvider, EventEmitter } from '@viewdo/ui';

export class MyProvider implements IDataProvider {
  data = {};
  constructor() {
    this.changed = new EventEmitter();
  }

  async get(key: string): Promise<string|null> {
    return this.data[key] || null;
  }
  async set(key: string, value: string): Promise<void> {
    this.data[key] = value.slice();
    this.changed.emit(DATA_EVENTS.DataChanged);
  }

  changed:EventEmitter;
}

````

### Sample Registrations

#### Native JS 
All that is needed by the data-system is a custom event with an instance of your provider in the details.data.provider property. *Note: be sure the event is composed, so it can reach shadow-dom listeners.*

````javascript

const customProvider = new MyProvider(); // IDataProvider
const event = new CustomEvent('xui:action-events:data', { 
  detail: { 
    command: 'register-provider'
    data: {
      name: 'myprovder,
      provider: customProvider,
    },
  }
});

document.body.dispatchEvent(event, { bubbles: true, composed: true})

````


#### As Component [StencilJS]

````typescript
import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';

@Component({
  tag: 'my-data-provider',
  shadow: false,
})
export class MyDataProvider {
  private customProvider = new MyProvider();

  /**
   * This event is raised when the component loads.
   * The data-provider system should capture this event
   * and register the provider for use in expressions.
   */
  @Event({
    eventName: 'xui:action-events:data',
    bubbles: true,
    composed: true,
  }) raiseAction: EventEmitter<any>;

  @State() keys = [];

  componentDidLoad() {
    this.raiseAction.emit({
      command: 'register-provider',
      data: {
        name: this.name,
        provider: this.customProvider,
      },
    });
  }
}
````

Then just include your component somewhere on the page:

````html
<x-ui>
  ...
 <my-data-provider></my-data-provider>
````