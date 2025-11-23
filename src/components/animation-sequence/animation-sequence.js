/*
 * Web component to play infiniate iterations through a sequence of images
 *
 */

import * as css from 'bundle-text:./animation-sequence.css'

class AnimationSequence extends HTMLElement {
  static get observedAttributes () {
    return ['top', 'left']
  }

  /**
   * @param {Object} obj - Configuration object for the animation, example:
   * {
   *   position: { top: 100, left: 200 },
   *   size: { width: 300, height: 200 },
   *   filenames: ['frame1.png', 'frame2.png', ...],
   *   images: [ImageObject, ...],
   *   sequence: [0,1,2,1,...]
   * }
   */
  set config (obj) {
    this._config = obj
    this.onConfigUpdate()
  }

  get config () {
    if (!this._config) {
      throw new Error('[CalendarDoor] config object not set')
    }
    return this._config
  }

  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <canvas></canvas>
    `
    this.$canvas = this.shadowRoot.querySelector('canvas')
    this.ctx = this.$canvas.getContext('2d')
  }

  onTick = frameIndex => {
    try {
      this.renderFrame(this.config.sequence[frameIndex])
    } catch (e) {
      console.error('Error rendering animation frame:', e)
    }
  }

  async onConfigUpdate () {
    this.style.top = `${this.config.position.top}px`
    this.style.left = `${this.config.position.left}px`
    this.style.width = `${this.config.size.width}px`
    this.style.height = `${this.config.size.height}px`
    this.$canvas.width = this.config.size.width
    this.$canvas.height = this.config.size.height
    this.renderFrame(0)
  }

  renderFrame (frameIndex) {
    const img = this.config.images[frameIndex]
    if (img) {
      this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height)
      this.ctx.drawImage(img, 0, 0, this.$canvas.width, this.$canvas.height)
    }
  }
}

customElements.define('animation-sequence', AnimationSequence)
