import { audioPlayer } from './audio-player.js'
import { assetLoader } from './asset-loader.js'
class UI {
  $app = null
  $animations = []

  constructor () {
    this.$app = this.selectElement('#app')
  }

  async revealCalendar () {
    return new Promise(resolve => {
      const $screen = this.selectElement('#title-screen')
      // $screen.remove()
      // resolve()

      // make sure the timing matches the CSS's move-up transition
      $screen.classList.add('move-up')
      setTimeout(() => {
        $screen.remove()
        resolve()
      }, 3000)
    })
  }

  async renderCalendarAssets () {
    const assets = assetLoader.assetMapping
    const $snow = this.selectElement('#snow-overlay')
    const $calendar = ui.selectElement('#calendar')
    await this.renderBackground($snow, $calendar, assets)
    this.renderDoors($calendar, assets)
    this.renderAnimations($calendar, assets)
  }

  async renderBackground ($snow, $calendar, { background }) {
    // ensure the image is loaded before applying to avoid flicker
    await assetLoader.refreshImage(background.filename)
    $snow.setAttribute('width', background.width)
    $snow.setAttribute('height', background.height)
    $calendar.style.backgroundImage = `url('images/${background.filename}')`
    $calendar.style.width = `${background.width}px`
    $calendar.style.height = `${background.height}px`
  }

  startSnow (flakeCount) {
    const $snow = this.selectElement('#snow-overlay')
    $snow.startSnow(flakeCount)
  }

  renderDoors ($calendar, { doors }) {
    $calendar.innerHTML = ''
    doors.forEach(door => $calendar.appendChild(this.buildDoorElement(door)))
  }

  renderAnimations ($calendar, { animations }) {
    animations.forEach(animation => {
      const $animation = document.createElement('animation-sequence')
      $animation.config = {
        ...animation,
        images: animation.filenames.map(filename =>
          assetLoader.getImage(filename)
        )
      }
      $calendar.appendChild($animation)
      this.$animations.push($animation)
    })
  }

  updateAnimations (frameIndex) {
    this.$animations.forEach($animation => {
      $animation.onTick(frameIndex)
    })
  }

  // @param {Object} openedDoors - map of door IDs that are opened
  // e.g. { door-1: true, door-3: true }
  reopenDoors (openedDoors = {}) {
    Object.keys(openedDoors).forEach(doorId => {
      const $door = this.selectElement(`#${doorId}`)
      $door.open()
    })
  }

  buildDoorElement (door) {
    const $door = document.createElement('calendar-door')
    $door.config = door
    return $door
  }

  async playSound (name, { loop = false } = {}) {
    await audioPlayer.play(name, {
      volume: assetLoader.audioInfo[name]?.volume || 1.0,
      loop
    })
  }

  playAmbience () {
    this.playSound('wind', { loop: true })
  }

  updateProgressBar ($bar, progress, minValue = 2) {
    // showing at least minValue indicates activity
    $bar.setAttribute('value', Math.max(progress, minValue))
  }

  configurePackages () {
    assetLoader.assetMapping.doors.forEach(door => {
      const $door = ui.selectElement(`#${door.id}`)
      const pkg = assetLoader.assetMapping.packages[door.packageId]
      $door.packageConfig = pkg
    })
  }

  enterFullscreen () {
    if (document.fullscreenElement) return
    this.$app.requestFullscreen()
  }

  exitFullscreen () {
    if (!document.fullscreenElement) return
    document.exitFullscreen()
  }

  selectElement (selector) {
    const $el = document.querySelector(selector)
    if (!$el) {
      throw new Error(`UI element not found: ${selector}`)
    }

    return $el
  }
}

export const ui = new UI()
