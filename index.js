const WORD = []
const LETTER_LIMIT = 5
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
const CRY_ANIMATION_DURATION = 1000
const WORD_OF_THE_DAY = 'throw'

const guessGrid = document.querySelector('[data-guess-grid]')
const keyboard = document.querySelector('[data-keyboard]')

const shakeTiles = (tiles) => {
  tiles.forEach((tile) => {
    tile.classList.add('-shake')
    tile.addEventListener(
      'animationend',
      () => {
        tile.classList.remove('-shake')
      },
      { once: true }
    )
  })
}

const flipTile = (tile, index, array, guess) => {
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key="${letter}"i]`)
  setTimeout(() => {
    tile.classList.add('-flip')
  }, (index * FLIP_ANIMATION_DURATION) / 2)

  tile.addEventListener(
    'transitionend',
    () => {
      tile.classList.remove('-flip')

      if (WORD_OF_THE_DAY[index] === letter) {
        tile.dataset.state = 'correct'
        key.classList.add('-correct')
      } else if (WORD_OF_THE_DAY.includes(letter)) {
        tile.dataset.state = 'warning'
        key.classList.add('-warning')
      } else {
        tile.dataset.state = 'wrong'
        key.classList.add('-wrong')
      }

      if (index === array.length - 1) {
        tile.addEventListener(
          'transitionend',
          () => {
            startInteration()
            gameOver(guess, array)
          },
          { once: true }
        )
      }
    },
    { once: true }
  )
}

const danceTiles = (tiles) => {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add('-dance')
      tile.addEventListener(
        'animationend',
        () => {
          tile.classList.remove('-dance')
        },
        { once: true }
      )
    }, (index * DANCE_ANIMATION_DURATION) / 5)
  })
}

const cryTiles = (tiles) => {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add('-down')
      tile.addEventListener(
        'animationend',
        () => {
          tile.classList.remove('-down')
        },
        { once: true }
      )
    }, (index * DANCE_ANIMATION_DURATION) / 5)
  })
}

const gameOver = (guess, tiles) => {
  const remainingTiles = guessGrid.querySelectorAll(':not([data-letter]')

  if (WORD_OF_THE_DAY === guess) {
    danceTiles(tiles)
    stopInteraction()
    return
  }

  if (remainingTiles.length === 0) {
    cryTiles(tiles)
    stopInteraction()
    return
  }
}

const getActiveTiles = () => {
  const activeTiles = guessGrid.querySelectorAll('.tile[data-state="active"]')
  return activeTiles
}

const removeLetter = () => {
  const activeTiles = getActiveTiles()
  if (activeTiles.length < 1) return

  const lastTile = activeTiles[activeTiles.length - 1]
  lastTile.textContent = ''
  delete lastTile.dataset.letter
  delete lastTile.dataset.state
  WORD.pop()
}

const submitWord = () => {
  const activeTiles = [...getActiveTiles()]
  const guess = WORD.join('')

  if (activeTiles.length < LETTER_LIMIT) {
    shakeTiles(activeTiles)
    return
  }

  stopInteraction()

  activeTiles.forEach((...params) => flipTile(...params, guess))
}

const pressKey = (key) => {
  const tile = guessGrid.querySelector(`:not([data-letter])`)
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
    tile.dataset.letter = key
    tile.dataset.state = 'active'
    tile.textContent = key
    WORD.push(key)
  }
}

const handleClick = (e) => {
  if (e.target.matches('[data-key]')) {
    pressKey(e.target.dataset.key.toLowerCase())
  }

  if (e.target.matches('[data-enter]')) {
    submitWord()
  }
  if (e.target.matches('[data-delete]')) {
    removeLetter()
  }
}

const handleKeyPress = (e) => {
  pressKey(e.key)
}

const startInteration = () => {
  document.addEventListener('click', handleClick)
  document.addEventListener('keydown', handleKeyPress)
}

const stopInteraction = () => {
  document.removeEventListener('click', handleClick)
  document.removeEventListener('keydown', handleKeyPress)
}

startInteration()
