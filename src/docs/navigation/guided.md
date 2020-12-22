# Guided Navigation

You can create smart guided navigation using simple conventions, visit-tracking and data-expressions to guide users through workflows or presentations.

> Using just static HTML, this page was able to create a rich navigation system that walks a user through content in a personalized, conversational format.

### Sequential Routes
By convention, routes are given an order based on how they are declared.

<ion-item>
  <ion-icon slot="start" name="play-forward-outline"></ion-icon>  
  <x-link href="/navigation/guided/sequential">
    Basic Guided Navigation
  </x-link>
</ion-item>

### Timed Routes

<ion-item>  
  <ion-icon slot="start" name="hourglass-outline"></ion-icon>
  <x-link href="/navigation/guided/timed">
    Automatic Navigation w/Time-based Routes
  </x-link>
  
</ion-item>

### Smart Routing

<ion-item>
  <ion-icon slot="start" name="bulb-outline"></ion-icon>
  <x-link href="/navigation/guided/smart">
    Smart Guidance w/Visit Tracking
  </x-link>

</ion-item>

### Rule Based Routes

<ion-item>
  <ion-icon slot="start" name="trail-sign-outline"></ion-icon>
  <x-link href="/navigation/guided/rules">
     Conditional Guidance Using Data & Expressions
  </x-link>

</ion-item>

### Convention-based Routing

<ion-item>
  <ion-icon slot="start" name="book-outline"></ion-icon>
  <x-link href="/navigation/guided/tutorial">
     Learn more about the convention-based routing
  </x-link>

</ion-item>
