/*
 * Game-loop based timer that emits 'tick' events at a regular interval.
 *
 */

class Timer {
  // 8 ticks per two seconds
  dt = 0
  counter = 0
  maxCounter = 8
  cutoff = (2 / 8) * 1000
  prevTime = 0
  ref = 0

  run = time => {
    if (this.prevTime > 0) {
      this.dt += time - this.prevTime

      if (this.dt >= this.cutoff) {
        this.dt %= this.cutoff
        this.counter = (this.counter + 1) % this.maxCounter
        this.tick()
      }
    }
    this.prevTime = time
    this.ref = requestAnimationFrame(this.run)
  }

  tick () {
    document.dispatchEvent(
      new CustomEvent('tick', {
        detail: { i: this.counter }
      })
    )
  }
}

export const timer = new Timer()
