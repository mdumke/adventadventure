import { assetLoader } from './asset-loader.js'
class UI {
  $app = null

  constructor () {
    this.$app = this.selectElement('#app')
  }

  revealCalendar () {
    const $screen = this.selectElement('#title-screen')
    //$screen.remove()
    $screen.classList.add('move-up')
    // make sure the timing matches the CSS's move-up transition
    setTimeout(() => $screen.remove(), 3000)
  }

  async renderCalendarAssets () {
    const assets = assetLoader.assetMapping
    const $snow = this.selectElement('#snow-overlay')
    const $calendar = ui.selectElement('#calendar')
    await this.renderBackground($snow, $calendar, assets)
    this.renderDoors($calendar, assets)
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

  startSnow () {
    const $snow = this.selectElement('#snow-overlay')
    $snow.startSnow(200)
  }

  renderDoors ($calendar, { doors }) {
    $calendar.innerHTML = ''
    doors.forEach(door => $calendar.appendChild(this.buildDoorElement(door)))
  }

  reopenDoors (openedDoors = {}) {
    Object.keys(openedDoors).forEach(doorId => {
      const $door = this.selectElement(`#${doorId}`)
      $door.openIfAllowed()
    })
  }

  // testAudio () {
  //   const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  //   const audio = new Audio('audio/srub.mp3')
  //   const track = audioCtx.createMediaElementSource(audio)
  //   track.connect(audioCtx.destination)
  //   audio.play()
  // }

  buildDoorElement (door) {
    const $door = document.createElement('calendar-door')
    $door.config = door
    return $door
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

  selectElement (selector) {
    const $el = document.querySelector(selector)
    if (!$el) {
      throw new Error(`UI element not found: ${selector}`)
    }

    return $el
  }
}

export const ui = new UI()
