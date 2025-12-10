/*
 * Web component that allows panning of its content area.
 *
 */

import { template } from './pannable-container.template.js'

/**
 * @element pannable-container
 * @summary Container web component that allows panning of its content area.
 *
 * @fires pan-start - Fired when a pan operation starts.
 * @fires pan-update - Fired when the pan position is updated.
 * @fires pan-end - Fired when a pan operation ends.
 */
class PannableContainer extends HTMLElement {
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
    this._maybeDragging = false
    this._startClientX = 0
    this._startClientY = 0
    this._startX = 0
    this._startY = 0

    // bounds
    this._maxX = 0
    this._maxY = 0

    // animation frame
    this._rafId = null
    this._frameRequested = false
    this._pendingX = 0
    this._pendingY = 0

    // resize observer
    this._ro = null

    // tap vs drag threshold (in pixels)
    this._dragThreshold = 6

    // pointer tracking
    this._activePointerId = null

    // suppress click after drag
    this._suppressNextClick = false
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
    const clampedX = this._clampX(x)
    const clampedY = this._clampY(y)
    this._applyTransform(clampedX, clampedY)
    this._emitEvent('pan-update', { x: clampedX, y: clampedY })
  }

  _onPointerDown = e => {
    if (!this._isLeftButtonEvent(e)) return
    if (this._isValidPointerEvent(e)) return

    // mark potential drag start
    this._maybeDragging = true
    this._activePointerId = e.pointerId
    this._suppressNextClick = false

    // record initial coordinates
    this._startClientX = e.clientX
    this._startClientY = e.clientY
    this._startX = this.currentX
    this._startY = this.currentY

    window.addEventListener('pointerup', this._onPointerUp)
    window.addEventListener('pointercancel', this._onPointerUp)
    window.addEventListener('pointermove', this._onPointerMove)
  }

  _onPointerUp = e => {
    this._maybeDragging = false
    this._activePointerId = null
    this.$viewport.releasePointerCapture?.(e.pointerId)

    window.removeEventListener('pointermove', this._onPointerMove)
    window.removeEventListener('pointerup', this._onPointerUp)
    window.removeEventListener('pointercancel', this._onPointerUp)

    if (!this._dragging) return

    this._dragging = false
    this._suppressNextClick = true

    if (this._frameRequested) {
      this._flushFrame()
    }

    this._emitEvent('pan-end', { x: this.currentX, y: this.currentY })
  }

  _onPointerMove = e => {
    if (!this._isValidPointerEvent(e)) return

    if (!this._dragging) {
      if (!this._maybeDragging) return
      if (!this._sufficientDistance(e)) return

      this._startDragging()
    }

    this._drag(e)
  }

  _isLeftButtonEvent (e) {
    return (e.buttons & 1) === 1
  }

  _isValidPointerEvent (e) {
    return (
      this._activePointerId !== null && e.pointerId === this._activePointerId
    )
  }

  _sufficientDistance (e) {
    const dx = e.clientX - this._startClientX
    const dy = e.clientY - this._startClientY
    const dist = Math.hypot(dx, dy)
    return dist >= this._dragThreshold
  }

  _startDragging () {
    this.$viewport.setPointerCapture(this._activePointerId)

    this._maybeDragging = false
    this._dragging = true

    this._emitEvent('pan-start', { x: this.currentX, y: this.currentY })
  }

  _drag (e) {
    e.preventDefault() // prevent selection/scroll while dragging

    const dx = e.clientX - this._startClientX
    const dy = e.clientY - this._startClientY

    const targetX = this._startX + dx
    const targetY = this._startY + dy

    this._pendingX = this._clampX(targetX)
    this._pendingY = this._clampY(targetY)

    if (!this._frameRequested) {
      this._frameRequested = true
      this._rafId = requestAnimationFrame(() => this._flushFrame())
    }
  }

  _flushFrame () {
    this._frameRequested = false
    this._applyTransform(this._pendingX, this._pendingY)
  }

  _cancelFrame () {
    cancelAnimationFrame(this._rafId)
    this._rafId = null
    this._frameRequested = false
  }

  _applyTransform (x, y) {
    this.currentX = x
    this.currentY = y
    this.$contentArea.style.transform = `translate3d(${x}px, ${y}px, 0)`
    this._emitEvent('pan-update', { x, y })
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

  _onClickCapture = e => {
    if (this._suppressNextClick) {
      e.stopImmediatePropagation()
      e.preventDefault()
      this._suppressNextClick = false
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
    this.addEventListener('click', this._onClickCapture, true)
  }

  _removeListeners () {
    this.$viewport.removeEventListener('pointerdown', this._onPointerDown)
    this.removeEventListener('click', this._onClickCapture, true)
    window.removeEventListener('pointermove', this._onPointerMove)
    window.removeEventListener('pointerup', this._onPointerUp)
    window.removeEventListener('pointercancel', this._onPointerUp)
  }
}

if (!customElements.get('pannable-container')) {
  customElements.define('pannable-container', PannableContainer)
}
