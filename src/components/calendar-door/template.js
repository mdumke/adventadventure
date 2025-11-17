import * as css from 'bundle-text:./calendar-door.css'

export const template = document.createElement('template')

template.innerHTML = `
  <style>${css}</style>

  <main>
    <div part="door-backdrop" class="door-backdrop">
      <loading-spinner></loading-spinner>
    </div>

    <div id="door-content" class="door-content" part="door-content">
      <div id="play-icon" class="play-icon hide" tabindex="0" role="button" aria-label="Play">
       </div>
    </div>

    <div id="door-frame" class="door-frame" part="door-frame">
      <div class="label-container" part="label-container">
        <div id="label-text"></div>
      </div>
    </div>
  </main>
`
