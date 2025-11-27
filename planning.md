# Planning

## features

- [x] pan image
- [x] open a single door
- [x] create title state
- [x] open multiple doors
- [x] support yt videos
- [x] play-btn on the door content
- [x] implement content loading strategy
- [x] build the background completely before lifting
- [x] restrict door access
- [x] content image passepartout
- [x] remember which doors are open
- [x] blur out edges of calendar to white
- [x] snow animations
- [x] play door sounds
- [x] play wind background sound
- [x] reveal calendar via slide
- [x] add sound-toggle in the calendar corner
- [x] start versioning releases
- [x] toggle full-screen view
- [x] support animations
- [x] remove title sliding
- [x] disable space-button panning
- [x] feedback when trying to open future doors
- [x] remember last scroll position
- [x] loudness / speaker test
- [ ] icons for title buttons
- [ ] moving clouds
- [ ] load thumbnails before opening calendar
- [ ] js-disabled message
- [ ] put placeholder image in media player (w/shadow)
- [ ] add full ambient soundscape
- [ ] door 24 with credits, greetings and full image
- [ ] build a title page
- [ ] error handling
- [ ] audio: loudness adjustments
- [ ] ensure timezone / day switch works

## backlog

- [ ] hide snowflakes behind clouds layer
- [ ] add navigation indicators to pan container
- [ ] move css for title state into html
- [ ] do we still need the preload?
- [ ] create a PWA
- [ ] load different images depending on resolution
- [ ] estimate network connection speed
- [ ] find a more appropriate font
- [ ] HTTP 2
- [ ] strategy for contact / copyright / cookies
- [ ] fade master gain on cancel

## production

- [ ] get a domain
- [ ] disable opening doors in november

## bugs

- [x] remove active flag after usage
- [x] allow progress bar an initial transition
- [x] provide fallback if thumnails not yet loaded
- [x] fix flickering before calendar rendering
- [x] reveal calendar without flickering even on re-focussing tab
- [x] show content thumbnails while curtain is lifting
- [x] don't play obsolete sound effects after audio resume
- [x] await package loading before starting animations
- [x] fix disallowed audio context start message
- [ ] ambience is back on after re-focus, even if off before

## refactorings

- [ ] use calendar class to keep track of doors
- [ ] move css button:active styling into the toggles

## assets

```yml
- ui / ux:
    - title and loading screen
      - with loudness / speaker test ?
    - texts

- images:
    - calendar image
    - door numbers
    - title graphics
    - favicon
    - page background (?)
    - audio player icons/buttons

- audio:
    - doors
    - clicks
    - ambience

- packages:
    - music + images + info
```

## decisions

- [x] One canonical-size image, pixel-perfect interactions, no retina support
- [x] Once a door is open, it stays open
- [x] All items will be videos, streamed via youtube
- [x] Weirdly long screens see the calandar image at the top, not centered
- [x] No doors on top of animations
- [x] a speaker test makes sense
- [x] all doors will have the same size

## discussion

- [x] animations concept
- [x] assets teilen -> email
- [x] title page
- [x] keep fullscreen button? yes
- [x] keep audio button? yes
- [ ] name / domain -> gerne, titel überlegen
- [ ] yt adds
  - werden gezeigt, wenn der channel monetarisiert
  - entweder in eigenen channel
  - oder sowas wie vimeo
- [ ] sound effects and ambience recordings
- [ ] texte / rundschreiben
- [ ] descriptions / title for videos (?)
  - in media player or on door-inside
- [ ] who found the video (?)
- [ ] glow behind active unopened doors (?)
- [ ] info door?
