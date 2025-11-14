import { assetLoader, STAGE_PACKAGE_THUMBNAILS } from '../asset-loader.js'
import { ui } from '../ui.js'

export class CalendarContext {
  key = 'calendar-context'
  $calendar = null

  enter () {
    this.render()
    this.$calendar = ui.selectElement('#calendar')
    this.$calendar.addEventListener('click', this.onCalendarClick)
    this.handlePackages()
  }

  exit () {
    this.$calendar.removeEventListener('click', this.onCalendarClick)
  }

  render () {
    ui.renderTemplate('#calendar-screen')
    ui.renderCalendarAssets()
    ui.selectElement('#pan-container').scrollToCenter()
  }

  onCalendarClick = event => {
    const $door = event.target.closest('[data-door]')
    if ($door) {
      return $door.setAttribute('open', 'true')
    }

    const $content = event.target.closest('[data-content]')
    if ($content) {
      console.log(`play ${$content.id}`)
    }
  }

  handlePackages () {
    assetLoader.packageThumbnailsReady
      ? this.configurePackages()
      : assetLoader.registerProgressCallback(this.key, this.onLoadingProgress)
  }

  configurePackages () {
    assetLoader.assetMapping.doors.forEach(door => {
      const $door = ui.selectElement(`#${door.id}`)
      const pkg = assetLoader.assetMapping.packages[door.packageId]
      $door.packageConfig = pkg
    })
  }

  onLoadingProgress = (stage, _, done) => {
    if (stage !== STAGE_PACKAGE_THUMBNAILS) return
    if (!done) return

    assetLoader.unregisterProgressCallback(this.key)
    this.configurePackages()
  }
}
