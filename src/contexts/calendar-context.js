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

  constructor () {
    this.startX = 0
    this.startY = 0
    this.dx = 0
    this.dy = 0
    this.walkX = 0
    this.walkY = 0
    this.maxX = 2560
    this.maxY = 1440
    this.borderSize = 50
    this.dragging = false
  }

  async enter () {
    this.openedDoors = loadOpenedDoors()
    await this.render()
    this.player = ui.selectElement('#media-player')
    this.$calendar = ui.selectElement('#calendar')
    this.$frame = ui.selectElement('#panic-container')
    this.$content = ui.selectElement('.pan-content')
    this.setStartPosition(1100, 200)
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
    ui.startSnow(400)
    await audioPlayer.decodeBuffers()
    ui.playAmbience()
  }

  onCalendarClick = event => {
    const $door = event.target.closest('[data-door]')
    if ($door) {
      event.preventDefault()
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

  setStartPosition (x, y) {
    this.shift(-x, -y)
    this.dx = -x
    this.dy = -y
    this.walkX = 0
    this.walkY = 0
  }

  shift (dx, dy) {
    const frameWidth = this.$frame.clientWidth || window.innerWidth
    this.walkX = Math.min(dx, -this.dx + this.borderSize)
    this.walkX = Math.max(
      this.walkX,
      frameWidth - this.borderSize - this.maxX - this.dx
    )

    const frameHeight = this.$frame.clientHeight || window.innerHeight
    this.walkY = Math.min(dy, -this.dy + this.borderSize)
    this.walkY = Math.max(
      this.walkY,
      frameHeight - this.borderSize - this.maxY - this.dy
    )

    const offsetX = this.dx + this.walkX
    const offsetY = this.dy + this.walkY
    this.$content.style.transform = `translate(${offsetX}px, ${offsetY}px)`
  }

  onWindowResize = () => {
    this.shift(this.walkX, this.walkY)
  }

  onPointerDown = e => {
    if (e.composedPath().some(el => el?.hasAttribute?.('data-door'))) return
    if (e.composedPath().some(el => el?.hasAttribute?.('data-content'))) return

    this.dragging = true
    this.$frame.setPointerCapture(e.pointerId)
    this.startX = e.clientX
    this.startY = e.clientY
  }

  onPointerMove = e => {
    if (this.dragging) {
      this.shift(e.clientX - this.startX, e.clientY - this.startY)
    }
  }

  onDragEnd = e => {
    this.dragging = false
    this.dx += this.walkX
    this.dy += this.walkY
    this.walkX = 0
    this.walkY = 0
    this.$frame.releasePointerCapture(e.pointerId)
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
    this.$frame.addEventListener('pointerdown', this.onPointerDown)
    this.$frame.addEventListener('pointermove', this.onPointerMove)
    this.$frame.addEventListener('pointerup', this.onDragEnd)
    this.$frame.addEventListener('pointercancel', this.onDragEnd)
    window.addEventListener('resize', this.onWindowResize)
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
    this.$frame.removeEventListener('pointerdown', this.onPointerDown)
    this.$frame.removeEventListener('pointermove', this.onPointerMove)
    this.$frame.removeEventListener('pointerup', this.onDragEnd)
    this.$frame.removeEventListener('pointercancel', this.onDragEnd)
    window.removeEventListener('resize', this.onWindowResize)
  }
}
