/*
 * Web component to show an embedded youtube video in a lightbox overlay.
 *
 */

import { template } from './template.js'

/**
 * @element media-player
 * @summary A media player lightbox for displaying images or videos.:w
 *
 * @part overlay - The overlay background element.
 * @part close-button - The button to close the lightbox.
 */
class MediaPlayer extends HTMLElement {
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
    this.$overlay.innerHTML = `
    <iframe
      src="${src}&autoplay=1&rel=0"
      frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
    `
    this.classList.remove('hide')
  }

  close = e => {
    if (e.target.tagName === 'IMG') return

    this.classList.add('hide')
    this.$overlay.innerHTML = ''
  }
}

customElements.define('media-player', MediaPlayer)
