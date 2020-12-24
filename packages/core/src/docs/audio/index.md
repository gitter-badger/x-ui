### XUI Audio

The audio player component is a set of two HTML Audio players designed to allow two layers of sound to play during an experience. There is an ambient and a voice layer for audio timed with the experience through route-changes and event actions.

The **Ambient** layer is meant to play background sounds or music. It should never hold audio with singing, talking, or any annoying sounds. These clips can loop.

The **Voice** layer is meant for short clips. The voice layer should never have music or background sounds.

#### Activation:
- **queued**: (default) plays after the previous audio is complete or when it's requested.
- **immediate**: stop any playing audio and play now, buffering be-damned.
- **hold**: wait for an event action before playing, any currently playing audio continues.

#### Deactivation:
-   video: when any video plays (default for voice)
-   state: state changes
-   event: wait for a stop event (or any other activation)
-   none: loop until stopped or updated by new state (default for ambient)

#### Replay:

If audio has replay set to true, re-entry to the originating state will re-activate the audio if the previous audio has been deactivated. The default is false.

### **Rules**:

- Many files can be configured and pre-loaded for each player.
- Only one audio file can be playing per layer at a time.
- Only the ambient audio can loop.
- Looping audio loops until its deactivation event.
- If audio is set to loop with no deactivation, any new configuration will end it. For instance, if new audio is configured to activate in a queued fashion, the looping audio should stop and allowing the queued audio to play when it ends.
- Hard deactivations should ease out the audio with a .5 second fade-out before playing the next clip.
- Audio must be configured before it can be played. *We won't support 'play this src' file in an Action Event.*
- Queued audio that doesn't get a chance to play before the next state change should be removed from the queue.