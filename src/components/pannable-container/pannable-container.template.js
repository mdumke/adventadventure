import * as css from 'bundle-text:./pannable-container.css'

export const template = document.createElement('template')

template.innerHTML = `
  <style>${css}</style>

  <div class="viewport hide-scrollbars" tabindex="0" role="group" aria-label="Pannable content">
    <div class="content-area">
      <slot></slot>
    </div>
  </div>
`
