/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}


/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const words = [
  'apple',
  'banana',
  'orange',
  'grapes',
  'cherry',
  'peach',
  'mango',
  'tomato',
  'potato',
  'carrot'
]


function App() {

  const [gameWords, setGameWords] = React.useState(() => {
    const saved = localStorage.getItem('gameWords')

    return saved ? JSON.parse(saved) : shuffle(words)
  })


  const [currentWord, setCurrentWord] = React.useState(() => {
    const saved = localStorage.getItem('currentWord')

    return saved ? saved : ''
  })


  const [guess, setGuess] = React.useState('')


  const [points, setPoints] = React.useState(() => {
    return Number(localStorage.getItem('points')) || 0
  })


  const [strikes, setStrikes] = React.useState(() => {
    return Number(localStorage.getItem('strikes')) || 0
  })


  const [passes, setPasses] = React.useState(() => {
    return Number(localStorage.getItem('passes')) || 3
  })


  const [message, setMessage] = React.useState('')


  const [gameOver, setGameOver] = React.useState(false)



  React.useEffect(() => {

    if (currentWord === '' && gameWords.length > 0) {
      setCurrentWord(shuffle(gameWords[0]))
    }

  }, [])



  React.useEffect(() => {

    localStorage.setItem(
      'gameWords',
      JSON.stringify(gameWords)
    )

    localStorage.setItem('currentWord', currentWord)
    localStorage.setItem('points', points)
    localStorage.setItem('strikes', strikes)
    localStorage.setItem('passes', passes)

  }, [gameWords, currentWord, points, strikes, passes])



  function submitHandler(e) {

    e.preventDefault()


    if (!gameWords[0]) {
      return
    }


    if (guess.toLowerCase() === gameWords[0].toLowerCase()) {

      setPoints(points + 1)
      setMessage('Correct! Next Word')


      const newWords = gameWords.slice(1)

      setGameWords(newWords)


      if (newWords.length > 0) {

        setCurrentWord(shuffle(newWords[0]))

      } else {

        setGameOver(true)

      }


    } else {

      const newStrikes = strikes + 1

      setStrikes(newStrikes)

      setMessage('Wrong! Try again')


      if (newStrikes >= 3) {

        setGameOver(true)

      }

    }


    setGuess('')

  }



  function passHandler() {


    if (passes > 0 && gameWords.length > 0) {


      const newWords = gameWords.slice(1)


      setGameWords(newWords)

      setPasses(passes - 1)

      setMessage('You passed. Next word')


      if (newWords.length > 0) {

        setCurrentWord(shuffle(newWords[0]))

      } else {

        setGameOver(true)

      }

    }

  }



  function restartHandler() {

    localStorage.clear()


    const newWords = shuffle(words)


    setGameWords(newWords)

    setCurrentWord(shuffle(newWords[0]))

    setGuess('')

    setPoints(0)

    setStrikes(0)

    setPasses(3)

    setMessage('')

    setGameOver(false)

  }



  return (

    <div className="container">

      <h1>Welcome to Scramble</h1>


      <div className="score">

        <div>
          <h2>{points}</h2>
          <p>Points</p>
        </div>


        <div>
          <h2>{strikes}</h2>
          <p>Strikes</p>
        </div>

      </div>



      <div className={`message ${
        message.includes('Correct')
          ? 'correct'
          : message.includes('Wrong')
            ? 'wrong'
            : message.includes('passed')
              ? 'passed'
              : ''
      }`}>
        {message}
      </div>



      <h2 className="word">
        {currentWord}
      </h2>



      <form onSubmit={submitHandler}
        style={{display: gameOver ? 'none' : 'block'}}>

        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess"
        />

      </form>



      <button
        className="pass-button"
        onClick={passHandler}
        disabled={passes === 0 || gameOver}
      >
        Pass ({passes})
      </button>



      {gameOver && (

        <div>

          <h2>Game Over</h2>

          <button onClick={restartHandler}>
            Play Again
          </button>

        </div>

      )}


    </div>

  )

}



const root = ReactDOM.createRoot(document.body)

root.render(<App />)