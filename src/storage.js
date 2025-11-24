/*
 * Manage interaction with localStorage
 *
 */

const OPENED_KEY = 'opened-doors'
const POSITION_KEY = 'last-position'

export function saveLastPosition (position) {
  const data = JSON.stringify(position)
  localStorage.setItem(POSITION_KEY, data)
}

export function loadLastPosition () {
  const data = localStorage.getItem(POSITION_KEY)
  if (!data) return null

  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export function saveOpenedDoors (openedDoors) {
  const data = JSON.stringify(openedDoors)
  localStorage.setItem(OPENED_KEY, data)
}

export function loadOpenedDoors () {
  const data = localStorage.getItem(OPENED_KEY)
  if (!data) return {}

  try {
    return JSON.parse(data)
  } catch {
    return {}
  }
}
