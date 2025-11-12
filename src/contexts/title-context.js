import { ui } from '../ui'
import { contextManager } from './context-manager'
import { CalendarContext } from './calendar-context.js'

export class TitleContext {
  $startBtn = null

  enter () {
    ui.renderTemplate('#title-screen')
    this.$startBtn = ui.selectElement('#start-button')
    this.$startBtn.addEventListener('click', this.onStartClick)
  }

  exit () {
    this.$startBtn.removeEventListener('click', this.onStartClick)
  }

  onStartClick = () => {
    contextManager.change(new CalendarContext())
  }
}
