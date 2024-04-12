import React, { useEffect, useState } from 'react';
import GuessMenu from './guessMenu';
import StartMenu from './startMenu';

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
  const [timer, setTimer] = useState(0);

  console.log('GUESSES:', guesses);
  console.log('correct word:', correctWord);
  /*   console.log('guessword:', guessWord);
  console.log('wordlength:', wordLength); */
  console.log('useDouble:', useDouble);
  /*  console.log('username:', userName);
  console.log('FEEDBACK:', feedback);
  console.log('TIMER:', timer);
 */
  useEffect(() => {
    let interval;
    if (gameStarted && !gameEnded) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameStarted, gameEnded]);

  function resetGame() {
    setUserName('');
    setUsedouble(false);
    setWordLength(4);
    setGuessWord('');
    setCorrectWord('');
    setFeedback([]);
    setGuesses([]);
    setTimer(0);
  }

  const saveGameStats = async () => {
    try {
      const response = await fetch('http://localhost:5080/api/gameStat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: userName,
          useDouble: useDouble,
          wordLength: wordLength,
          guesses: guesses.length,
          timer: timer,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save game stats');
      }
      console.log('Game stats saved successfully!');
    } catch (error) {
      console.error('Error saving game stats:', error);
    }
  };

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

      if (useDouble) {
        settingsWordlist = settingsWordlist.filter((word) => hasDouble(word));
      } else {
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
      <a href='/'>Home</a>
      <a href='/api/highscore'>Highscore</a>
      <a href='/api/aboutUs'>About us</a>
      <h1>This is Wordle 3</h1>
      {!gameStarted && (
        <StartMenu
          userName={userName}
          setUserName={setUserName}
          useDouble={useDouble}
          setUsedouble={setUsedouble}
          wordLength={wordLength}
          setWordLength={setWordLength}
          handleStartGame={handleStartGame}
        />
      )}
      {gameStarted && (
        <GuessMenu
          guessWord={guessWord}
          setGuessWord={setGuessWord}
          handleGuess={handleGuess}
          guesses={guesses}
        />
      )}
      {gameEnded && (
        <div className='modal'>
          <div className='modal-content'>
            <p>Congratulations, {userName}! You won!</p>

            <button
              onClick={async () => {
                resetGame();
                setGameEnded(false);
                setGameStarted(false);
                await saveGameStats();
              }}
            >
              Send to highscore and play again
            </button>

            <button
              onClick={() => {
                resetGame();
                setGameEnded(false);
                setGameStarted(false);
              }}
            >
              Play Again and dont save
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default GameContainer;
