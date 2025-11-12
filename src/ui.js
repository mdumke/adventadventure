class UI {
  $app = null

  constructor () {
    this.$app = this.selectElement('#app')
  }

  renderTemplate (selector) {
    const template = this.selectElement(selector)
    const clone = template.content.cloneNode(true)
    this.$app.innerHTML = ''
    this.$app.appendChild(clone)
  }

  selectElement (selector) {
    const $el = document.querySelector(selector)
    if (!$el) {
      throw new Error(`UI element not found: ${selector}`)
    }

    return $el
  }
}

export const ui = new UI()
