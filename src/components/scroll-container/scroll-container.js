/*
 * Web component that allows panning of its content area.
 *
 */

import { template } from './scroll-container.template'

/**
 * @element scroll-container
 * @summary Container web component that allows panning of its content area.
 *
 * @fires pan-start - Fired when a pan operation starts.
 * @fires pan-update - Fired when the pan position is updated.
 * @fires pan-end - Fired when a pan operation ends.
 */
class ScrollContainer extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$viewport = this.shadowRoot.querySelector('.viewport')
    this.$contentArea = this.shadowRoot.querySelector('.content-area')

    // state
    this.currentX = 0
    this.currentY = 0
    this._dragging = false
    this._startClientX = 0
    this._startClientY = 0
    this._startX = 0
    this._startY = 0

    // bounds
    this._maxX = 0
    this._maxY = 0

    // animation frame
    this._frameRequested = false
    this._pendingX = 0
    this._pendingY = 0

    // resize observer
    this._ro = null
  }

  connectedCallback () {
    this._registerListeners()
    this._ro = new ResizeObserver(this._resize)
    this._ro.observe(this.$viewport)
    this._ro.observe(this.$contentArea)
    this._resize()
  }

  disconnectedCallback () {
    this._removeListeners()
    if (this._ro) {
      this._ro.disconnect()
      this._ro = null
    }
    this._cancelFrame()
  }

  panTo (x, y) {
    const clampedX = this._clampX(-x)
    const clampedY = this._clampY(-y)
    this._applyTransform(clampedX, clampedY)
    this._emitEvent('pan-update', { x: clampedX, y: clampedY })
  }

  _onPointerDown = e => {
    if (e.button && e.button !== 0) return // Only left button

    this._dragging = true
    this._startClientX = e.clientX
    this._startClientY = e.clientY
    this._startX = this.currentX
    this._startY = this.currentY
    this.$viewport.setPointerCapture(e.pointerId)

    window.addEventListener('pointerup', this._onPointerUp)
    window.addEventListener('pointercancel', this._onPointerUp)
    window.addEventListener('pointermove', this._onPointerMove, {
      passive: false
    })

    this._emitEvent('pan-start', { x: this.currentX, y: this.currentY })
  }

  _onPointerUp = e => {
    if (!this._dragging) return

    this._dragging = false
    this.$viewport.releasePointerCapture?.(e.pointerId)
    window.removeEventListener('pointermove', this._onPointerMove)
    window.removeEventListener('pointerup', this._onPointerUp)
    window.removeEventListener('pointercancel', this._onPointerUp)

    if (this._frameRequested) {
      this._flushFrame()
    }

    this._emitEvent('pan-end', { x: this.currentX, y: this.currentY })
  }

  _onPointerMove = e => {
    if (!this._dragging) return

    e.preventDefault() // prevent selection/scroll while dragging

    const dx = e.clientX - this._startClientX
    const dy = e.clientY - this._startClientY

    const targetX = this._startX + dx
    const targetY = this._startY + dy

    this._pendingX = this._clampX(targetX)
    this._pendingY = this._clampY(targetY)

    if (!this._frameRequested) {
      this._frameRequested = true
      requestAnimationFrame(() => this._flushFrame())
    }

    this._emitEvent('pan-update', { x: this._pendingX, y: this._pendingY })
  }

  _flushFrame () {
    this._frameRequested = false
    this._applyTransform(this._pendingX, this._pendingY)
  }

  _cancelFrame () {
    this._frameRequested = false
  }

  _applyTransform (x, y) {
    this.currentX = x
    this.currentY = y
    this.$contentArea.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  _clampX (x) {
    return Math.max(-this._maxX, Math.min(0, x))
  }

  _clampY (y) {
    return Math.max(-this._maxY, Math.min(0, y))
  }

  _resize = () => {
    const { vw, vh, cw, ch } = this._getDimensions()

    this._maxX = Math.max(0, cw - vw)
    this._maxY = Math.max(0, ch - vh)

    const newX = this._clampX(this.currentX)
    const newY = this._clampY(this.currentY)

    if (newX !== this.currentX || newY !== this.currentY) {
      this._applyTransform(newX, newY)
    }
  }

  _getDimensions () {
    const { clientWidth, clientHeight } = this.$viewport
    const { scrollWidth, scrollHeight } = this.$contentArea

    return {
      vw: clientWidth || this.$viewport.getBoundingClientRect().width,
      vh: clientHeight || this.$viewport.getBoundingClientRect().height,
      cw: scrollWidth || this.$contentArea.getBoundingClientRect().width,
      ch: scrollHeight || this.$contentArea.getBoundingClientRect().height
    }
  }

  _emitEvent (name, detail = {}) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true
      })
    )
  }

  _registerListeners () {
    this.$viewport.addEventListener('pointerdown', this._onPointerDown)
  }

  _removeListeners () {
    this.$viewport.removeEventListener('pointerdown', this._onPointerDown)
    window.removeEventListener('pointermove', this._onPointerMove)
    window.removeEventListener('pointerup', this._onPointerUp)
    window.removeEventListener('pointercancel', this._onPointerUp)
  }
}

if (!customElements.get('scroll-container')) {
  customElements.define('scroll-container', ScrollContainer)
}
