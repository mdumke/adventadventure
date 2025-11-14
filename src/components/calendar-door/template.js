import css from 'bundle-text:./calendar-door.css'

export const template = document.createElement('template')

template.innerHTML = `
  <style>${css}</style>

  <main>
    <div id="door-content" class="door-content" part="door-content"></div>

    <div id="door-frame" class="door-frame">
      <div class="label-container" part="label-container">
        <div id="label-text"></div>
      </div>
    </div>
  </main>
`
