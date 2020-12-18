# Present HTML Animation

This page is part of a guided-navigation system. The back and next are automatically defined based on the convention we discussed.

The above is done using special attributes that only work on a guided route ````x-view-do```

````html
<ion-card>
  <ion-card-media>
    <ion-img id="step1" hidden
      x-in-time="1"
      x-out-time="9"
      src="https://via.placeholder.com/728x390.png?text=Step+1"></ion-img>
    <ion-img id="step2" hidden
      x-in-time="10"
      x-out-time="19"
      src="https://via.placeholder.com/728x390.png?text=Step+2"></ion-img>
    <ion-img id="step3" hidden
      x-in-time="20"
      x-out-time="29"
      src="https://via.placeholder.com/728x390.png?text=Step+3"></ion-img>
  </ion-card-media>
  <ion-progress-bar color="primary"
    x-percentage-to="value"></ion-progress-bar>
  <ion-card-content>

    <p>Progress: <span x-percentage-to></span></p>

    <div hidden
      x-int-time="0" x-in-class="fade-in"
      x-out-time="9" x-out-class="fade-out"
      >
      <h1>Step 1 Stuff</h1>
      <p>Fake Step 1 copy. </p>
    </div>

    <div hidden
      x-in-time="10" x-in-class="fade-in"
      x-out-time="19" x-out-class="fade-out"
      >
      <h1>Step 2 Stuff</h1>
      <p>Fake Step 2 copy. </p>
    </div>

    <div hidden
      x-in-time="20" x-in-class="fade-in"
      x-out-time="30" x-out-class="fade-out"
      >
      <h1>Step 3 Stuff</h1>
      <p>Fake Step 3 copy. </p>
    </div>

  </ion-card-content>
</ion-card>
````