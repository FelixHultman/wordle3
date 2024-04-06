import React, { useState } from 'react';
/* import fetchWordList from '../../../backend/fetchWordlist'; */

function GameContainer() {
  const [userName, setUserName] = useState('');
  const [useDouble, setUsedouble] = useState(false);
  const [wordLength, setWordLength] = useState(4);
  const [guessWord, setGuessWord] = useState('');
  const [correctWord, setCorrectWord] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [guesses, setGuesses] = useState([]);

  console.log('GUESSES:', guesses);
  console.log('correct word:', correctWord);
  console.log('guessword:', guessWord);
  console.log('wordlength:', wordLength);
  console.log('useDouble:', useDouble);
  console.log('username:', userName);
  console.log('FEEDBACK:', feedback);

  const handleStartGame = async () => {
    try {
      const response = await fetch('http://localhost:5080/api/wordlist');
      const data = await response.json();

      const wordList = data.wordlist;
      console.log('word list:', wordList);
      const randomIndex = Math.floor(Math.random() * wordList.length);
      const randomWord = wordList[randomIndex];
      setCorrectWord(randomWord);
    } catch (error) {
      console.error('Error fetching word', error);
    }
  };

  const handleGuess = async () => {
    if (!guessWord || !correctWord) {
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
      setGuesses((prevGuesses) => [...prevGuesses, guessWord]);
    } catch (error) {
      console.error('Error guess word'.error);
    }
  };
  return (
    <section>
      <h1>This is Wordle 2</h1>

      <menu>
        <p>
          Choose your game settings and name here {userName} {guessWord}
        </p>
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
          <select onChange={(e) => setWordLength(e.target.value)}>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
          </select>
          <button onClick={handleStartGame}>Press here to start game</button>
        </label>
      </menu>
      <div>
        <p></p>
        <label htmlFor=''>
          Write guess:
          <input type='text' onChange={(e) => setGuessWord(e.target.value)} />
          <button onClick={handleGuess}>Confirm guess</button>
        </label>
        <ul>
          <li>
            {feedback.map((item, index) => (
              <span key={index} style={{ color: item.color }}>
                {item.letter}
              </span>
            ))}
          </li>
        </ul>
      </div>
    </section>
  );
}

export default GameContainer;
