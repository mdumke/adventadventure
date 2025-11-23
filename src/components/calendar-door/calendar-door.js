/*
 * Web component that prepares a calendar door element, incluing data
 * loading, opening animation, and content display.
 *
 */

import { template } from './template.js'
import { allowOpen } from '../../utils.js'

/**
 * @element calendar-door
 * @summary A calendar door that can be opened to reveal content.
 *
 * @fires show-player - Fired when the door content is clicked to display the player.
 * The event detail contains an object: { src: string } with the content source URL.
 *
 * @part label-container - The container element for the door label.
 * @part door-content - The content area revealed when the door is opened.
 */
class CalendarDoor extends HTMLElement {
  /**
   * @property {Object} config - Configuration object for the door, example:
   * {
   *   id: 'door-01',
   *   label: '1',
   *   position: { x: 100, y: 200 },
   *   size: { width: 91, height: 131 },
   *   filename: 'doors/door-01.png',
   *   packageId: 'package-01'
   * }
   */
  static get observedAttributes () {
    return ['preload']
  }

  set config (obj) {
    this._config = obj
    this.update()
  }

  get config () {
    if (!this._config) {
      throw new Error('[CalendarDoor] config object not set')
    }
    return this._config
  }

  /**
   * @property {Object} packageConfig - Configuration object for the package
   * associated with this door. Example:
   * {
   *   thumbnail: 'packages/record-01.webp',
   *   src: 'https://example.com/xyz',
   * }
   */
  set packageConfig (pkg) {
    this._packageConfig = pkg
    this.updatePackage()
  }

  get packageConfig () {
    if (!this._packageConfig) {
      throw new Error('[CalendarDoor] packageConfig object not set')
    }
    return this._packageConfig
  }

  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$doorFrame = this.shadowRoot.querySelector('#door-frame')
    this.$doorLabel = this.shadowRoot.querySelector('#label-text')
    this.$doorContent = this.shadowRoot.querySelector('#door-content')
  }

  connectedCallback () {
    this.dataset.interactive = ''
    this.dataset.door = ''
    this.update()
  }

  attributeChangedCallback (name, _oldValue, newValue) {
    if (name === 'open' && newValue !== null) {
      return this.openDoor()
    }
    this.update()
  }

  update () {
    this.id = this.config.id

    const { top, left } = this.config.position || {}
    const { width, height } = this.config.size || {}
    this.style.width = `${width}px`
    this.style.height = `${height}px`
    this.style.top = `${top}px`
    this.style.left = `${left}px`

    const imgSrc = this.config.filename
    this.$doorFrame.style.backgroundImage = `url('images/${imgSrc}')`
    this.$doorLabel.textContent = this.config.label
  }

  updatePackage () {
    const imgSrc = this.packageConfig.thumbnail
    this.$doorContent.style.backgroundImage = `url('images/${imgSrc}')`
    this.$doorContent.querySelector('#play-icon').classList.remove('hide')
  }

  openIfAllowed () {
    if (this.mayOpen()) this.open()
  }

  mayOpen () {
    return allowOpen(this.config.label)
  }

  open () {
    const width = this.config.size.width
    this.$doorFrame.style.transform = `translateX(-${width - 2}px)`
    this.$doorFrame.classList.add('open')
    this.removeAttribute('data-door')
    this.setAttribute('open', 'true')
    this.dataset.content = ''
  }

  displayContent () {
    this.dispatchEvent(
      new CustomEvent('show-player', {
        bubbles: true,
        composed: true,
        detail: { src: this.packageConfig.src }
      })
    )
  }
}

customElements.define('calendar-door', CalendarDoor)
