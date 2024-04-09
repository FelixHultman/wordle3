import React, { useEffect, useState } from 'react';

function GameContainer() {
  const [userName, setUserName] = useState('');
  const [useDouble, setUsedouble] = useState(false);
  const [wordLength, setWordLength] = useState(4);
  const [guessWord, setGuessWord] = useState('');
  const [correctWord, setCorrectWord] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  console.log('GUESSES:', guesses);
  console.log('correct word:', correctWord);
  console.log('guessword:', guessWord);
  console.log('wordlength:', wordLength);
  console.log('useDouble:', useDouble);
  console.log('username:', userName);
  console.log('FEEDBACK:', feedback);

  useEffect(() => {
    if (gameStarted) {
      handleStartGame();
    }
  }, [gameStarted]);

  function resetGame() {
    setUserName('');
    setUsedouble(false);
    setWordLength(4);
    setGuessWord('');
    setCorrectWord('');
    setFeedback([]);
    setGuesses([]);
  }

  function hasDouble(word) {
    const letters = {};
    for (const letter of word) {
      if (letters[letter]) {
        return true;
      }
      letters[letter] = true;
    }
    return false;
  }

  const handleStartGame = async () => {
    try {
      const response = await fetch('http://localhost:5080/api/wordlist');
      const data = await response.json();

      let settingsWordlist = data.wordlist;

      settingsWordlist = settingsWordlist.filter(
        (word) => word.length === wordLength
      );

      if (!useDouble) {
        settingsWordlist = settingsWordlist.filter((word) => !hasDouble(word));
      }

      console.log('word list:', settingsWordlist);
      const randomIndex = Math.floor(Math.random() * settingsWordlist.length);
      const randomWord = settingsWordlist[randomIndex];
      setCorrectWord(randomWord);

      setGameStarted(true);
    } catch (error) {
      console.error('Error fetching word', error);
    }
  };

  const handleGuess = async () => {
    if (!guessWord || !correctWord) {
      return;
    }

    if (guessWord.length !== correctWord.length) {
      alert('Your guess is not matching the length of the correct word');
      return;
    }

    if (guessWord === correctWord) {
      setGameEnded(true);
      return;
    }
    try {
      const response = await fetch('http://localhost:5080/api/guessWord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guessWord, correctWord }),
      });
      const data = await response.json();
      setFeedback(data);
      setGuesses((prevGuesses) => [
        ...prevGuesses,
        { guessWord, feedback: data },
      ]);

      setGuessWord('');
    } catch (error) {
      console.error('Error guess word'.error);
    }
  };

  return (
    <section>
      <h1>This is Wordle 2</h1>
      {!gameStarted && (
        <menu>
          <p>Choose your game settings and name here</p>
          <label>
            Write your name here:
            <input
              type='text'
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </label>
          <label>
            Do you want words with double letters
            <input
              type='checkbox'
              checked={useDouble}
              onChange={(e) => setUsedouble(e.target.checked)}
            ></input>
          </label>

          <label>
            <select onChange={(e) => setWordLength(parseInt(e.target.value))}>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
            </select>
            <button onClick={handleStartGame}>Press here to start game</button>
          </label>
        </menu>
      )}
      {gameStarted && (
        <div>
          <p></p>
          <label htmlFor=''>
            Write guess:
            <input
              type='text'
              value={guessWord}
              onChange={(e) => setGuessWord(e.target.value)}
            />
            <button onClick={handleGuess}>Confirm guess</button>
          </label>
          <ul>
            {guesses
              .slice()
              .reverse()
              .map((guess, guessIndex) => (
                <li key={guessIndex}>
                  {guess.guessWord.split('').map((letter, letterIndex) => (
                    <span
                      key={letterIndex}
                      style={{ color: guess.feedback[letterIndex].color }}
                    >
                      {letter.toUpperCase()}
                    </span>
                  ))}
                </li>
              ))}
          </ul>
        </div>
      )}
      {gameEnded && (
        <div className='modal'>
          <div className='modal-content'>
            <p>Congratulations, {userName}! You won!</p>
            <button
              onClick={() => {
                resetGame();
                setGameEnded(false);
                setGameStarted(false);
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default GameContainer;
