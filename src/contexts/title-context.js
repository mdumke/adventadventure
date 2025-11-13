import { assetLoader } from '../asset-loader.js'
import { ui } from '../ui'
import { contextManager } from './context-manager'
import { CalendarContext } from './calendar-context.js'

export class TitleContext {
  $startBtn = null
  $progressBar = null
  assetsLoaded = false
  autoSwitch = false

  enter () {
    ui.renderTemplate('#title-screen')
    assetLoader.preloadCalendarAssets(this.onLoadingProgress)
    this.$startBtn = ui.selectElement('#start-button')
    this.$progressBar = ui.selectElement('#progress-bar')
    this.$startBtn.addEventListener('click', this.onStartClick)
  }

  onLoadingProgress = progress => {
    this.$progressBar.setAttribute('value', progress)
    this.assetsLoaded = progress >= 100

    if (this.assetsLoaded && this.autoSwitch) {
      // Small delay to let the user see 100% completion
      setTimeout(this.goToCalendar, 800)
    }
  }

  exit () {
    this.$startBtn.removeEventListener('click', this.onStartClick)
  }

  onStartClick = () => {
    this.assetsLoaded ? this.goToCalendar() : this.waitForPreload()
  }

  waitForPreload = () => {
    this.$startBtn.classList.add('hide')
    this.$progressBar.classList.remove('hide')
    this.autoSwitch = true
  }

  goToCalendar = () => {
    contextManager.change(new CalendarContext())
  }
}
