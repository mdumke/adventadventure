import { audioPlayer } from './audio-player'

const ASSET_MAPPING_PATH = 'assets.json'
const IMAGE_BASE_PATH = 'images'

export const STAGE_INITIAL = 'stage-initial'
export const STAGE_CALENDAR_ASSETS = 'stage-calendar-assets'
export const STAGE_PACKAGE_THUMBNAILS = 'stage-package-thumbnails'
export const STAGE_COMPLETE = 'stage-complete'

class AssetLoader {
  loadingStage = STAGE_INITIAL
  progress = 0
  progressCallbacks = []
  cachedImages = {}
  cachedAudioBuffers = {}
  audioInfo = {}

  _assetMapping = null

  get assetMapping () {
    if (!this._assetMapping) {
      throw new Error('Asset mapping not loaded yet')
    }
    return Object.freeze(this._assetMapping)
  }

  get calendarAssetsReady () {
    return [STAGE_PACKAGE_THUMBNAILS, STAGE_COMPLETE].includes(
      this.loadingStage
    )
  }

  get packageThumbnailsReady () {
    return this.loadingStage === STAGE_COMPLETE
  }

  async run () {
    await this.loadAssetMapping()
    await this.preloadCalendarAssets()
    await this.preloadPackageThumbnails()
    this.loadingStage = STAGE_COMPLETE
  }

  registerProgressCallback (key, cb) {
    cb(this.loadingStage, this.progress)
    this.progressCallbacks.push({ key, cb })
  }

  unregisterProgressCallback (key) {
    this.progressCallbacks = this.progressCallbacks.filter(
      item => item.key !== key
    )
  }

  // Load calendar assets with progress callback
  // onProgress: function(stage, percent, done) => void
  async preloadCalendarAssets () {
    this.loadingStage = STAGE_CALENDAR_ASSETS

    const imageFilenames = [
      this._assetMapping.background.filename,
      ...this._assetMapping.doors.map(door => door.filename)
    ]

    const audioFiles = this._assetMapping.audio

    let total = imageFilenames.length + audioFiles.length
    let count = 0

    await this.preloadImages(imageFilenames, () => {
      count++
      this.onProgress(count, total)
    })

    await Promise.all(
      audioFiles.map(async ({ name, filename, volume }) => {
        await audioPlayer.load(name, `audio/${filename}`, { volume })
        count++
        this.audioInfo[name] = { volume }
        this.onProgress(count, total)
      })
    )
  }

  onProgress (loaded, total) {
    const progress = total === 0 ? 0 : Math.floor((loaded / total) * 100)
    this.progress = progress
    this.progressCallbacks.forEach(({ cb }) =>
      cb(this.loadingStage, progress, progress === 100)
    )
  }

  async preloadPackageThumbnails () {
    this.loadingStage = STAGE_PACKAGE_THUMBNAILS

    const imageFilenames = this._assetMapping.doors.map(
      ({ packageId }) => this._assetMapping.packages[packageId]?.thumbnail
    )

    await assetLoader.preloadImages(imageFilenames, (loaded, total) => {
      const progress = total === 0 ? 0 : Math.floor((loaded / total) * 100)
      this.progress = progress
      this.progressCallbacks.forEach(({ cb }) =>
        cb(this.loadingStage, progress, progress === 100)
      )
    })
  }

  async preloadImages (filenames, onProgress) {
    let total = filenames.length
    let loaded = 0

    const imagePromises = filenames.map(filename =>
      this.preloadImage(`${IMAGE_BASE_PATH}/${filename}`).then(img => {
        this.cachedImages[filename] = img
        loaded++
        if (onProgress) onProgress(loaded, total)
        return img
      })
    )

    await Promise.all(imagePromises)
  }

  async preloadImage (src) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () =>
        reject(new Error(`[AssetLoader] failed to load image: ${src}`))
      img.src = src
    })
  }

  async loadAssetMapping () {
    const response = await fetch(ASSET_MAPPING_PATH)
    this._assetMapping = await response.json()
  }

  async refreshImage (src) {
    const img = this.cachedImages[src]

    if (!img) {
      throw new Error(`[AssetLoader] image not cached: ${src}`)
    }

    try {
      await img.decode()
    } catch {
      // ignore decode errors
    }
  }
}

export const assetLoader = new AssetLoader()
