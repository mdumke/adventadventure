class AudioPlayer {
  constructor () {
    this.audioCtx = null
    this.buffers = {}
  }

  play (name) {
    if (!this.audioCtx) {
      console.warn(
        `[AudioPlayer] cannot play "${name}": audio context is locked`
      )
      return
    }

    const buffer = this.buffers[name]
    if (!buffer) {
      console.warn(`[AudioPlayer] cannot play "${name}": buffer not found`)
      return
    }

    const source = this.audioCtx.createBufferSource()
    source.buffer = buffer
    source.connect(this.audioCtx.destination)
    source.start(0)
  }

  // Loads audio files and converts them to AudioBuffers.
  // This can be done even when the AudioContext is suspended.
  async load (name, src) {
    const raw = await fetch(src)
    const buffer = await raw.arrayBuffer()
    this.buffers[name] = buffer
  }

  async unlock () {
    if (this.audioCtx) return

    this.audioCtx = new AudioContext()
    await this.audioCtx.resume()
    await this.decodeBuffers()
    this.locked = false
  }

  async decodeBuffers () {
    if (!this.audioCtx) {
      console.warn('[AudioPlayer] cannot decode: audio context is locked')
      return
    }

    if (!this.audioCtx.state === 'running') {
      console.warn('[AudioPlayer] cannot decode: audio context is not running')
      return
    }

    await Promise.all(
      Object.entries(this.buffers).map(async ([name, arrayBuffer]) => {
        const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer)
        this.buffers[name] = audioBuffer
      })
    )
  }
}

export const audioPlayer = new AudioPlayer()
