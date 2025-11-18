import { assetLoader, STAGE_PACKAGE_THUMBNAILS } from '../asset-loader.js'
import { loadOpenedDoors, saveOpenedDoors } from '../storage.js'
import { ui } from '../ui.js'

export class CalendarContext {
  key = 'calendar-context'
  openedDoors = {}
  $calendar = null

  async enter () {
    this.openedDoors = loadOpenedDoors()
    await this.render()
    this.$calendar = ui.selectElement('#calendar')
    this.$calendar.addEventListener('click', this.onCalendarClick)
    this.$calendar.addEventListener('show-player', this.onShowPlayer)
    this.player = ui.selectElement('#media-player')
    this.handlePackages()
  }

  exit () {
    this.$calendar.removeEventListener('click', this.onCalendarClick)
  }

  async render () {
    await ui.renderCalendarAssets()
    ui.reopenDoors(this.openedDoors)
    ui.selectElement('#pan-container').scrollToCenter()
    ui.revealCalendar()
  }

  onCalendarClick = event => {
    const $door = event.target.closest('[data-door]')
    if ($door) {
      this.openedDoors[$door.id] = true
      saveOpenedDoors(this.openedDoors)
      $door.openIfAllowed()
      return
    }

    const $content = event.target.closest('[data-content]')
    if ($content) {
      $content.displayContent()
    }
  }

  onShowPlayer = event => {
    this.player.displayImage(event)
  }

  handlePackages () {
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
}
