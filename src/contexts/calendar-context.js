import { audioPlayer } from '../audio-player.js'
import { assetLoader, STAGE_PACKAGE_THUMBNAILS } from '../asset-loader.js'
import {
  loadOpenedDoors,
  saveOpenedDoors,
  saveLastPosition
} from '../storage.js'
import { timer } from '../timer.js'
import { ui } from '../ui.js'

export class CalendarContext {
  key = 'calendar-context'
  openedDoors = {}
  $calendar = null

  async enter () {
    this.openedDoors = loadOpenedDoors()
    await this.render()
    this.player = ui.selectElement('#media-player')
    this.$calendar = ui.selectElement('#calendar')
    this.registerListeners()
    this.prepareContentPackages()
    this.startAnimationTimer()
    ui.revealCalendar()
  }

  exit () {
    this.removeListeners()
  }

  async render () {
    await ui.renderCalendarAssets()
    ui.reopenDoors(this.openedDoors)
    ui.restoreLastPosition()
    ui.startSnow(400)
    await audioPlayer.decodeBuffers()
    ui.playAmbience()
  }

  onCalendarClick = event => {
    const $door = event.target.closest('[data-door]')
    if ($door) {
      return this.onDoorClick($door)
    }

    const $content = event.target.closest('[data-content]')
    if ($content) {
      $content.displayContent()
    }
  }

  onDoorClick ($door) {
    if (!$door.mayOpen()) {
      return ui.handleForbiddenDoor($door)
    }

    this.openedDoors[$door.id] = true
    saveOpenedDoors(this.openedDoors)
    $door.open()
    ui.playSound('door')
  }

  onShowPlayer = event => {
    ui.stopAmbience()
    this.player.displayImage(event)
  }

  onPlayerClosed = () => {
    ui.playAmbience()
  }

  onAudioMute = async () => {
    await ui.playSound('click')
    audioPlayer.pause(true)
  }

  onAudioUnmute = () => {
    ui.playSound('click')
    audioPlayer.resume(true)
  }

  onEnterFullscreen = () => {
    ui.enterFullscreen()
  }

  onExitFullscreen = () => {
    ui.exitFullscreen()
  }

  onVisibilityChange = () => {
    if (document.hidden) {
      audioPlayer.pause()
    } else {
      audioPlayer.resume()
    }
  }

  onTick = e => {
    ui.updateAnimations(e.detail.i)
  }

  onKeyDown = e => {
    if (e.code === 'Space') e.preventDefault()
  }

  onPanUpdate = e => {
    saveLastPosition({
      x: e.detail.scrollLeft,
      y: e.detail.scrollTop
    })
  }

  prepareContentPackages () {
    assetLoader.packageThumbnailsReady
      ? ui.configurePackages()
      : assetLoader.registerProgressCallback(this.key, this.onLoadingProgress)
  }

  onLoadingProgress = (stage, _, done) => {
    if (stage !== STAGE_PACKAGE_THUMBNAILS) return
    if (!done) return

    assetLoader.unregisterProgressCallback(this.key)
    ui.configurePackages()
  }

  startAnimationTimer () {
    timer.run()
  }

  registerListeners () {
    this.$calendar.addEventListener('click', this.onCalendarClick)
    document.addEventListener('show-player', this.onShowPlayer)
    document.addEventListener('player-closed', this.onPlayerClosed)
    document.addEventListener('audio-mute', this.onAudioMute)
    document.addEventListener('audio-unmute', this.onAudioUnmute)
    document.addEventListener('enter-fullscreen', this.onEnterFullscreen)
    document.addEventListener('exit-fullscreen', this.onExitFullscreen)
    document.addEventListener('visibilitychange', this.onVisibilityChange)
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('tick', this.onTick)
    document.addEventListener('pan-update', this.onPanUpdate)
  }

  removeListeners () {
    this.$calendar.removeEventListener('click', this.onCalendarClick)
    document.removeEventListener('show-player', this.onShowPlayer)
    document.removeEventListener('player-closed', this.onPlayerClosed)
    document.removeEventListener('audio-mute', this.onAudioMute)
    document.removeEventListener('audio-unmute', this.onAudioUnmute)
    document.removeEventListener('enter-fullscreen', this.onEnterFullscreen)
    document.removeEventListener('exit-fullscreen', this.onExitFullscreen)
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('tick', this.onTick)
    document.removeEventListener('pan-update', this.onPanUpdate)
  }
}
