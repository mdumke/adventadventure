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
- [x] ensure timezone / day switch works
- [x] support opening to right
- [x] create 24 doors
- [x] gh pages deployment
- [x] icons for title buttons
- [x] remove sound check
- [x] use start image in title screen
- [x] build a title page
- [x] include animations
- [ ] show video titles
- [ ] add full ambient soundscape
- [ ] js-disabled message
- [ ] moving clouds
- [ ] error handling
- [ ] audio: loudness adjustments

## backlog

- [ ] hide snowflakes behind clouds layer
- [ ] cache by rendering full images hidden
- [ ] add navigation indicators to pan container
- [ ] door 24 with credits, greetings and full image
- [ ] put placeholder image in media player (w/shadow)
- [ ] load thumbnails before opening calendar
- [ ] move css for title state into html
- [ ] do we still need the preload?
- [ ] create a PWA
- [ ] load different images depending on resolution
- [ ] estimate network connection speed
- [ ] find a more appropriate font
- [ ] HTTP 2
- [ ] strategy for contact / copyright / cookies
- [ ] fade master gain on cancel
- [ ] glow behind active unopened doors

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
- [x] ambience is back on after re-focus, even if off before

## refactorings

- [ ] use calendar class to keep track of doors
- [ ] move css button:active styling into the toggles

## assets

```yml
- images:
    - calendar image
    - door numbers
    - title
    - speaker test button
    - start button
    - favicon

- audio:
    - doors
    - clicks
    - ambience

- packages:
    - music + images + info

- text:
    - welcome / about
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
- [x] yt adds
  - werden gezeigt, wenn der channel monetarisiert
  - entweder in eigenen channel
  - oder sowas wie vimeo
- [ ] sound effects and ambience recordings
- [ ] texte / rundschreiben
- [ ] descriptions / title for videos (?)
  - in media player or on door-inside
- [ ] who found the video (?)
- [ ] info door (?)
- [ ] xmasmisfits.de (?)
- [ ] titles for vidoes in player (?)
