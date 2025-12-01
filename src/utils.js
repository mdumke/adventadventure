/*
 * Various helper functions
 *
 */

export const allowOpen = doorLabel => {
  return true
  // const now = new Date()
  // const year = now.getFullYear()
  // if (year > 2025) return true

  // const maxDay = now.getDate()
  // const day = parseInt(doorLabel, 10)

  // return !isNaN(day) && day <= maxDay
}

export const debug = message => {
  const $debug = document.getElementById('debug')
  if ($debug) {
    $debug.textContent = message
  } else {
    console.log('[Debug]', message)
  }
}
