import { assetLoader } from './asset-loader.js'
class UI {
  $app = null

  constructor () {
    this.$app = this.selectElement('#app')
  }

  renderTemplate (selector) {
    const template = this.selectElement(selector)
    const clone = template.content.cloneNode(true)
    this.$app.innerHTML = ''
    this.$app.appendChild(clone)
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
    $door.config = { ...door, size: { width: 91, height: 131 } }
    return $door
  }

  updateProgressBar ($bar, progress, minValue = 2) {
    // showing at least minValue indicates activity
    $bar.setAttribute('value', Math.max(progress, minValue))
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
