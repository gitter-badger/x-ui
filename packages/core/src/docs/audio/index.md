# Audio

The audio player component is a set of two HTML Audio players designed to allow two layers of sound to play during an experience. There is an music and a sound layer for audio timed with the experience through route-changes and event actions.

The **Music** layer is meant to play background sounds or music. It should never hold audio with singing, talking, or any annoying sounds. These clips can loop.

The **Sound** layer is meant for short clips. The sound layer should never have music or background sounds.

#### Mode:
- **queue**: (default) plays after the previous audio is complete or when it's requested.
- **play**: stop any playing audio and play now, buffering be-damned.
- **wait**: wait for an event action before playing, any currently playing audio continues.

#### Discard:
- video: when any video plays (default for sound)
- state: state changes
- event: wait for a stop event (or any other activation)
- none: loop until stopped or updated by new state (default for music)

#### Track:

If audio has replay set to true, re-entry to the originating state will re-activate the audio if the previous audio has been deactivated. The default is false.

### Rules:

- Many files can be configured and pre-loaded for each player.
- Only one audio file can be playing per layer at a time.
- Only the music audio can loop.
- Looping audio loops until its deactivation event.
- If audio is set to loop with no deactivation, any new configuration will end it. For instance, if new audio is configured to activate in a queued fashion, the looping audio should stop and allowing the queued audio to play when it ends.
- Hard deactivations ease out the audio with a .5 second fade-out before playing the next clip.
- Queued audio that doesn't get a chance to play before the next state change is removed from the queue.