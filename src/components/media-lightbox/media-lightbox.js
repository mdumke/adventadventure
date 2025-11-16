/*
 * Web component to display a large image in a lightbox overlay.
 *
 */

import { template } from './template.js'

/**
 * @element media-lightbox
 * @summary A lightbox component to display large images overlayed on the page.
 *
 * @part overlay - The overlay background element.
 * @part close-button - The button to close the lightbox.
 */
class MediaLightbox extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$overlay = this.shadowRoot.querySelector('[part="overlay"]')
    this.$closeButton = this.shadowRoot.querySelector('[part="close-button"]')
  }

  connectedCallback () {
    this.classList.add('hide')
    this.$overlay.addEventListener('click', this.close)
    this.$closeButton.addEventListener('click', this.close)
  }

  disconnectedCallback () {
    this.$overlay.removeEventListener('click', this.close)
    this.$closeButton.removeEventListener('click', this.close)
  }

  displayImage (event) {
    const { src } = event.detail
    this.$overlay.innerHTML = `<img src="${src}" alt="Media Content" />`
    this.classList.remove('hide')
  }

  close = e => {
    if (e.target.tagName === 'IMG') return

    this.classList.add('hide')
    this.$overlay.innerHTML = ''
  }
}

customElements.define('media-lightbox', MediaLightbox)
