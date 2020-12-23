# Declarative Guided Navigation

Experience content is presentational in nature. Content is concise with minimal noise and tends to have an implicit ending; a selection was made, the form was completed, the video ended or the next button was clicked.

Static content has no end and leaves the user to decide what to do.  

Experiences have static content, but it is typically found at the end or as an informational page offshoot. In most cases, revisiting an experience shows this static page, with links to revisit the presentation, re-watch a video, or update data that was collected.

Navigation can be categorized into two distinct strategies: **static** and **guided**. Static is simple; the link doesn’t change. Guided navigation takes the user to the next route of content dynamically in sequence with regard to certain rules. 

Guided navigation gets complex. Expressing rules for where to go next can quickly get unruly, especially considering a user can drop out of an experience and return at any time. 


## Guided Navigation by Convention

Let’s take what we know about experiences and make some assumptions to simplify a navigation strategy for determining what should come next.

Let’s assume all experiences end with static content that has flat navigation. Let’s also assume this content lives at a base-route.  

````
Path: /home
Content: static html
Navigation: static
````

Let’s also assume presentation content must live as sub-routes under their declaring static route and presentation content uses a guided navigation strategy. 

Let also say before we present our static content, the user must first visit each of the sub-routes defined in the order they are listed. 

````
Path: /home/step-1
Content: presentational
Navigation: guided

Path: /home/step-2
Content: presentational
Navigation: guided

Path: /home/step-3
Content: presentational
Navigation: guided

Path: /home
Content: static html
Navigation: static
````

With these two assumptions our router can make a global rule: before we present our static content, the user must first visit each of the sub-routes defined in the order they are listed.

If we create a list of must-visit sub-routes, the navigation strategy becomes simple: 

**Static Route Rules:**

1. Check store for visited sub-routes & remove from the must-visit list
1. Pop the first sub-route from the must-visit list & navigate to it
1. If the list is empty, display content


**Guided Route Rules:**
1. Store Visit
1. Display content
2. Next always returns to parent route

Each sub route displays its content and returns to the parent route when the presentation ends or the user clicks ‘Next’. The home route re-evaluates the same rule-set until all sub-routes are visited.

With this simple construct, we could return a user to the last place they were in the sequence without much heavy lifting, restoring abandoned experiences, and completed experiences when they return.

That’s great, but we still need to solve for content routes that should only be visited under certain conditions.

## Convention with Visit-tracking

Let’s add a new property to each sub-route to describe the visit strategy for the parent route to determine if a sub-route should be visited before displaying the home route.  

Our visit requirements are: 

__Always__ visit this state every time a user re-enters the experience.  The tracking is done in-memory. 

__Once__ ensures the route is visited at least once before showing the static view. The visit is tracked in a persistent way

__Optional__ should not be tracked or included in the must-visit list. This sub-route must be directly navigated to. _This is how choice-based navigation structures would work._

This changes our routing rules to be:

**Static Route Rules:**

1. Check store for visited sub-routes & remove from the must-visit list
1. Find the first sub-route that hasn’t been visited and is not **Optional**
    * If found
      1. Remove Route from List
      1. Navigate to Route
    * Not found, display content


**Guided Route Rules:**
1. If **Once**, store Visit
1. Display content
2. Next always returns to parent route

Now we can express a navigated routing system like this:

````
Path: /home/welcome
Visit: always

Path: /home/choose-favorite  // choice links to red or blue
Visit: once

Path: /home/choice-red
Visit: optional

Path: /home/choice-blue
Visit: optional

Path: /home
````
> In this example, the sub-route “choose-favorite” displays a list of choices, each with its own direct links to its corresponding optional sub-routes. If Next() was clicked, the user would return home.

Now we have sub-routes that won’t automatically be visited if they are optional. They could only be visited by explicit navigation.

## Convention with Conditional Routes & Visit-tracking

The above strategies account for most experience navigation rules, but we are still missing the ability to have navigation conditioned on existing data, collected in previous steps or part of the starting data set. 

Let’s first assume the data context is established and there is a persistent data store providing data to the view engine.  

> The data store is left generic on purpose, however, for our purposes, this would be experience data.

We are going to add a new  strategy called **When**. The **When** visit strategy informs the navigation system to derive the strategy from the expression contained in the  **When** property. The  **When** expression evaluates to true or false. 

* When true, the visit strategy is **Once**
* When false, the visit strategy is **Optional**

**Example:  Sub Route Required w/Data equal to a Value**
````
Path: /home/choice-red
When: color = red
````

**Example:  Sub Route Required w/Data is set**
````
Path: /home/answer-exists
When: answer != null
````

**Example:  Sub Route Required w/Multiple Data Conditions**
````
Path: /home/complex-example
When: (answer != null && age > 21) || verified = false
````

Building on these assumptions, conventions, and two properties the view engine can construct a robust data-driven rule-based system for guided navigation without a complex rule-engine. The expression evaluation is the most complex aspect of this engine, but this is established at the sub-route – and all other routes have no context of navigating anywhere based on rules.

Now let’s move out of theory any into our new HTML Elements.

## Views and Dos

In our examples above, we discussed routes and sub-routes. The routes are expressed in our Experience UI using the **`<x-view>`** tag and their sub-routes would be **`<x-view-do>`** tags.  

The default visit-requirement is ‘once’, so it can be omitted. Also, if the 'when’ property exists, the visit requirement is always derived from that expression, leaving few occasions where we have to express the visit-strategy.

Views can also contain other Views, with their own Dos, so this construct can be expanded to create a very deep rule-based view-engine with semantic URLs.

These tags are explained in detail within their own component requirements, but here is an example of their structure in HTML:

**Example View.DO Site:**

````html
<x-ui>
  <x-view path="/start" 
    page-title="Home">
    <x-view-do url="/welcome"
      visit="always">
      ...
    </x-view-do>
    <x-view-do url="/get-name" 
      page-title="What's your name?"
      when="name == null"
      type="input">
      ...
    </x-view-do>
    <x-view-do url="/hi-name" 
      page-title="Hello!">
      ...
    </x-view-do>
    <x-view-do url="/video-intro"
      visit="optional"
      type="video">
      ...
    </x-view-do>
    <x-view url="/about"  
      page-title="About Us">
      <x-view-do url="/meet-mike"
        page-title="About Mike">
        ...
      </x-view-do>
      <x-view-do url="/meet-paul"
        page-title="About Paul">
        ...
      </x-view-do>
      <x-view-do url="/meet-jason"
        page-title="About Jason">
        ...
      </x-view-do>
      <x-do url="/meet-max"
        page-title="About Max"
        ...>
      </x-view-do>
      ... home page content
    </x-view>
  </x-view>
</x-ui>
````
This structure would first ask the newcomer’s name, then use it with a welcome message. It would offer a link to our intro video, but would just go home when they clicked __next__.

There is a sub-route “/about” that walks the user through a presentation of each person at the company ending with static content about the company.


### View & View-Do Sequence Diagram

![sequence-diagram](https://static.view.do/viewdo/ui/view-do-navigation-sequence.png)