import './components/calendar-door/calendar-door.js'
import './components/pan-container/pan-container.js'
import './components/progress-bar/progress-bar.js'

import { contextManager } from './contexts/context-manager.js'
import { TitleContext } from './contexts/title-context.js'

const main = () => {
  contextManager.change(new TitleContext())
}

document.addEventListener('DOMContentLoaded', main, { once: true })
