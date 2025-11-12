import './components/pan-container/pan-container.js'

import { contextManager } from './contexts/context-manager.js'
import { TitleContext } from './contexts/title-context.js'

const main = () => {
  contextManager.change(new TitleContext())
}

document.addEventListener('DOMContentLoaded', main, { once: true })
