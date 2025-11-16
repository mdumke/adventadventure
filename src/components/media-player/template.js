import * as css from 'bundle-text:./media-player.css'

export const template = document.createElement('template')

template.innerHTML = `
  <style>${css}</style>

  <div part="overlay" class="overlay"></div>
  <button part="close-button" class="close-button" aria-label="Close">
    &times;
  </button>
`
