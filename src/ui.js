import { assetLoader } from './asset-loader.js'
class UI {
  $app = null

  constructor () {
    this.$app = this.selectElement('#app')
  }

  revealCalendar () {
    const $screen = this.selectElement('#title-screen')
    $screen.remove()
    // $screen.classList.add('move-up')
    // // make sure the timing matches the CSS's move-up transition
    // setTimeout(() => $screen.remove(), 3000)
  }

  renderCalendarAssets () {
    const assets = assetLoader.assetMapping
    const $calendar = ui.selectElement('#calendar')
    this.renderBackground($calendar, assets)
    this.renderDoors($calendar, assets)
  }

  renderBackground ($calendar, { background }) {
    $calendar.style.backgroundImage = `url('images/${background.filename}')`
    $calendar.style.width = `${background.width}px`
    $calendar.style.height = `${background.height}px`
  }

  renderDoors ($calendar, { doors }) {
    $calendar.innerHTML = ''
    doors.forEach(door => $calendar.appendChild(this.buildDoorElement(door)))
  }

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
