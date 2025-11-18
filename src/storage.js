/*
 * Manage interaction with localStorage
 *
 */

const STORAGE_KEY = 'opened-doors'

export function saveOpenedDoors (openedDoors) {
  const data = JSON.stringify(openedDoors)
  localStorage.setItem(STORAGE_KEY, data)
}

export function loadOpenedDoors () {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return {}

  try {
    return JSON.parse(data)
  } catch {
    return {}
  }
}
