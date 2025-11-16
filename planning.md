# Planning

## features

- [x] pan image
- [x] open a single door
- [x] create title state
- [x] open multiple doors
- [x] support yt videos
- [ ] implement content loading strategy
- [ ] play-btn on the door content
- [ ] build the background completely before lifting
- [ ] remember which doors are open
- [ ] snow animations
- [ ] load different images depending on resolution
- [ ] estimate network connection speed
- [ ] restrict door access
- [ ] HTTP 2
- [ ] door creaks as it moves over
- [ ] loudness / speaker test
- [ ] store media in local storage
- [ ] strategy for contact / copyright / cookies
- [ ] error handling
- [ ] create a PWA
- [ ] js-disabled message
- [ ] audio: loudness adjustments
- [ ] optimize media for download

## bugs

- [x] remove active flag after usage
- [x] allow progress bar an initial transition
- [ ] fix flickering before calendar rendering
- [ ] provide fallback if thumnails not loaded
- [ ] red background when image is smaller than screen

## assets

```yml
- ui / ux:
    - title and loading screen
      - with loudness / speaker test ?
    - texts

- images:
    - calendar image
    - [doors]
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
- [ ] does a speaker test make sense?
