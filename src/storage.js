/*
 * Manage interaction with localStorage
 *
 */

const OPENED_KEY = 'opened-doors'

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
