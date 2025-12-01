import { assetLoader, STAGE_CALENDAR_ASSETS } from '../asset-loader.js'
import { ui } from '../ui'
import { contextManager } from './context-manager'
import { CalendarContext } from './calendar-context.js'

export class TitleContext {
  key = 'title-context'
  loadingProgress = 0
  autoSwitch = false
  $startBtn = null
  $progressBar = null

  enter () {
    this.$startBtn = ui.selectElement('#start-button')
    this.$progressBar = ui.selectElement('#progress-bar')
    assetLoader.registerProgressCallback(this.key, this.onLoadingProgress)
    assetLoader.run()
    this.registerListeners()
  }

  exit () {
    this.removeListeners()
  }

  onLoadingProgress = (stage, progress, done) => {
    if (stage !== STAGE_CALENDAR_ASSETS) return

    this.loadingProgress = progress
    if (!this.autoSwitch) return

    this.updateProgressBar()
    if (!done) return

    assetLoader.unregisterProgressCallback(this.key)

    // Small delay to let users see 100% completion
    setTimeout(this.goToCalendar, 1200)
  }

  onStartClick = () => {
    assetLoader.calendarAssetsReady
      ? this.goToCalendar()
      : this.waitForPreload()
  }

  waitForPreload = () => {
    this.$startBtn.classList.add('hide')
    this.$progressBar.classList.remove('hide')
    this.autoSwitch = true

    // give the bar a chance to render with width 0 first to enable transition
    setTimeout(this.updateProgressBar, 0)
  }

  goToCalendar = () => {
    contextManager.change(new CalendarContext())
  }

  updateProgressBar = () => {
    ui.updateProgressBar(this.$progressBar, this.loadingProgress)
  }

  registerListeners () {
    this.$startBtn.addEventListener('click', this.onStartClick)
  }

  removeListeners () {
    this.$startBtn.removeEventListener('click', this.onStartClick)
  }
}
