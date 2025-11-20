export class SnowCanvas {
  // Central configuration object for snowfall tuning
  static DEFAULT_CONFIG = {
    radius: { min: 1, range: 4 },
    opacity: { min: 0.9, range: 0.1 },
    blur: { min: 3, range: 1 },
    fallSpeed: { min: 0.1, range: 0.7 },
    driftSpeed: { baseRange: 0.1, depthRange: 1.8 },
    driftPhaseIncrement: { base: 0.01, factor: 0.01 }
  }

  constructor ($canvas, config = {}) {
    this.$canvas = $canvas
    this.ctx = $canvas.getContext('2d')
    this.snowflakes = []
    this.running = false
    this.animate = this.animate.bind(this)
    this.config = { ...SnowCanvas.DEFAULT_CONFIG, ...config }
  }

  start (count) {
    this.initSnowflakes(count)
    if (!this.running) {
      this.running = true
      this.animate()
    }
  }

  stop () {
    this.running = false
  }

  setConfig (partial) {
    this.config = { ...this.config, ...partial }
  }

  initSnowflakes (count) {
    this.snowflakes = []
    const cfg = this.config

    for (let i = 0; i < count; i++) {
      const depth = Math.random() // 0 = far, 1 = near

      this.snowflakes.push({
        depth,
        x: Math.random() * this.$canvas.width,
        y: Math.random() * this.$canvas.height,
        radius: cfg.radius.min + depth * cfg.radius.range,
        opacity: cfg.opacity.min + depth * cfg.opacity.range,
        blur: cfg.blur.min + depth * cfg.blur.range,
        speed: cfg.fallSpeed.min + depth * cfg.fallSpeed.range,

        // drifting (sideways drift + drift phase
        xSpeed:
          (Math.random() - 0.5) *
          (cfg.driftSpeed.baseRange + depth * cfg.driftSpeed.depthRange),
        xOffset: Math.random() * Math.PI * 2
      })
    }
  }

  animate () {
    if (!this.running) return

    const { ctx, $canvas } = this
    ctx.clearRect(0, 0, $canvas.width, $canvas.height)

    for (const flake of this.snowflakes) {
      this.drawFlake(flake)

      flake.y += flake.speed

      // drifting: gentle wave motion
      flake.x += flake.xSpeed * Math.sin(flake.xOffset)
      flake.xOffset +=
        this.config.driftPhaseIncrement.base +
        flake.depth * this.config.driftPhaseIncrement.factor

      if (flake.y > $canvas.height) {
        flake.y = -flake.radius
        flake.x = Math.random() * $canvas.width
        flake.xOffset = Math.random() * Math.PI * 2
      }
    }

    requestAnimationFrame(this.animate)
  }

  drawFlake ({ x, y, radius, opacity, blur }) {
    const ctx = this.ctx

    ctx.save()
    ctx.globalAlpha = opacity
    ctx.shadowBlur = blur
    ctx.shadowColor = '#006b66ff'
    ctx.fillStyle = '#ffffffff'

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }
}
