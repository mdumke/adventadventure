import './components/calendar-door/calendar-door.js'
import './components/pan-container/pan-container.js'
import './components/progress-bar/progress-bar.js'
import './components/media-player/media-player.js'
import './components/loading-spinner/loading-spinner.js'
import './components/blur-overlay/blur-overlay.js'
import './components/snow-overlay/snow-overlay.js'
import './components/audio-toggle/audio-toggle.js'
import './components/fullscreen-toggle/fullscreen-toggle.js'
import './components/animation-sequence/animation-sequence.js'

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
