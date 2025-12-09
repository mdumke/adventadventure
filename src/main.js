import './components/index.js'

import { contextManager } from './contexts/context-manager.js'
import { TitleContext } from './contexts/title-context.js'
import { audioPlayer } from './audio-player.js'

const main = () => {
  if (location.hash === '#reset') {
    localStorage.clear()
  }

  contextManager.change(new TitleContext())
}

document.addEventListener('DOMContentLoaded', main, { once: true })

const initAudio = () => {
  audioPlayer.init()
  document.removeEventListener('click', initAudio)
}

document.addEventListener('click', initAudio)
