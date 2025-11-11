import css from 'bundle-text:./pan-container.css'

export const template = document.createElement('template')

template.innerHTML = `
  <style>${css}</style>

  <main>
    <slot></slot>
  </main>
`
