const WORD = []
const LETTER_LIMIT = 5
const WORD_OF_THE_DAY = 'THROW'

const keys = document.querySelectorAll('[data-key]')
const enterKey = document.querySelector('[data-enter]')
const deleteKey = document.querySelector('[data-delete]')

const getActiveTiles = () => {
  const activeTiles = document.querySelectorAll('.tile[data-state="active"]')
  return activeTiles
}

const removeLetter = () => {
  const activeTiles = getActiveTiles()
  if (activeTiles.length < 1) return

  const lastTile = activeTiles[activeTiles.length - 1]
  lastTile.textContent = ''
  delete lastTile.dataset.tile
  delete lastTile.dataset.state
  WORD.pop()
}

const submitWord = () => {
  const activeTiles = getActiveTiles()
  if (activeTiles.length < LETTER_LIMIT) {
    // animation shake
    return
  }

  
}

const pressKey = (key) => {
  const tile = document.querySelector(`.tile:not([data-tile])`)
  const activeTiles = getActiveTiles()

  if (key === 'Enter') {
    submitWord()
    return
  }
  if (key === 'Backspace' || key === 'Delete') {
    removeLetter()
    return
  }
  if (activeTiles.length >= LETTER_LIMIT) return

  if (key.match(/^[a-z]$/)) {
    tile.dataset.tile = key
    tile.dataset.state = 'active'
    tile.textContent = key
    pressKey(key)
  }
}

keys.forEach((key) => {
  key.addEventListener('click', (event) => {
    pressKey(event.target.dataset.key.toLowerCase())
  })
})

enterKey.addEventListener('click', () => {
  //submit guess
})

deleteKey.addEventListener('click', removeLetter)

document.addEventListener('keydown', (event) => {
  pressKey(event.key)
})
