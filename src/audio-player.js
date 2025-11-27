class AudioPlayer {
  constructor () {
    this.locked = true
    this.audioCtx = null
    this.masterGain = null
    this.arrayBuffers = {}
    this.audioBuffers = {}
    this.activeSources = {
      sounds: {},
      tracks: {}
    }
    this.manualPause = false
  }

  async init () {
    if (this.audioCtx) return

    this.audioCtx = new AudioContext()
    this.masterGain = this.audioCtx.createGain()
    this.masterGain.gain.value = 1.0
    this.masterGain.connect(this.audioCtx.destination)
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume()
    }
    await this.decodeBuffers()
    this.locked = false
  }

  get isPaused () {
    return this.audioCtx ? this.audioCtx.state === 'suspended' : true
  }

  async playSound (name, { volume } = {}) {
    return this._play(name, 'sounds', { volume })
  }

  async playAmbienceTrack (name, { volume } = {}) {
    return this._play(name, 'tracks', { volume, loop: true })
  }

  async stopAmbienceTrack (name) {
    this._stop(name, 'tracks')
  }

  async _play (name, key, { volume = 1.0, loop = false } = {}) {
    if (!this.audioCtx) {
      return console.warn(`[AudioPlayer] audio context is locked`)
    }

    return new Promise(resolve => {
      const source = this.audioCtx.createBufferSource()
      source.buffer = this.audioBuffers[name]
      source.loop = loop

      const gain = this.audioCtx.createGain()
      gain.gain.value = Math.max(0, volume)

      source.connect(gain)
      gain.connect(this.masterGain)
      source.start(0)

      this.activeSources[key][name] = { source, gain }
      source.onended = () => {
        delete this.activeSources[key][name]
        resolve()
      }
    })
  }

  _stop (name, key) {
    if (!this.audioCtx) {
      return console.warn(`[AudioPlayer] audio context locked`)
    }

    const entry = this.activeSources[key][name]
    if (!entry) return

    entry.source.stop()
  }

  register (name, arrayBuffer) {
    this.arrayBuffers[name] = arrayBuffer
  }

  async pause (manual = false) {
    if (!this.audioCtx) {
      return console.warn('[AudioPlayer] cannot pause: audio context locked')
    }
    if (this.audioCtx.state === 'suspended') return
    await this.audioCtx.suspend()
    if (manual) {
      this.manualPause = true
    }
  }

  async resume (manual = false) {
    if (!this.audioCtx) {
      return console.warn('[AudioPlayer] cannot resume: audio context locked')
    }
    if (this.audioCtx.state === 'running') {
      await this.audioCtx.resume()
    }
    if (this.manualPause && !manual) {
      // do not auto-resume if manually paused
      return
    }

    // only resume ambience tracks; sound effects are one-shots
    this.clearSources('sounds')
    this.manualPause = false
    await this.audioCtx.resume()
  }

  clearSources (key) {
    Object.keys(this.activeSources[key]).forEach(name => {
      this._stop(name, key)
    })
  }

  async decodeBuffers () {
    if (!this.audioCtx) {
      return console.warn('[AudioPlayer] cannot decode: audio context locked')
    }

    if (this.audioCtx.state !== 'running') {
      await this.audioCtx.resume()
    }

    try {
      await Promise.all(
        Object.entries(this.arrayBuffers).map(async ([name, arrayBuffer]) => {
          const bufferCopy = arrayBuffer.slice(0)
          const audioBuffer = await this.audioCtx.decodeAudioData(bufferCopy)
          this.audioBuffers[name] = audioBuffer
        })
      )
    } catch (error) {
      return `Error during audio decoding: ${error.message}`
    }

    this.arrayBuffers = {}
  }
}

export const audioPlayer = new AudioPlayer()
