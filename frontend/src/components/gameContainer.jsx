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
      const response = await fetch('/api/gameStat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: userName,
          correctWord: correctWord,
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
      const response = await fetch('/api/wordlist');
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
      const response = await fetch('/api/guessWord', {
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
    <section class="flex flex-col items-center text">
      <header class='text-6xl space-x-6 pb-14 bg-gray-500 w-full flex justify-center items-center'>
        <a href='/'>Home</a>
        <a href='/highscore'>Highscore</a>
        <a href='/aboutUs'>About us</a>
      </header>
      <h1 class='text-5xl pb-14 pt-20'>This is Wordle 3</h1>
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
        <div class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div class="bg-white p-8 rounded-lg">
            <p>Congratulations, {userName}! You won!</p>

            <button class="mt-4 mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={async () => {
                resetGame();
                setGameEnded(false);
                setGameStarted(false);
                await saveGameStats();
              }}
            >
              Send to highscore and play again
            </button>

            <button class="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
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
