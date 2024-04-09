import React from 'react';

function GuessMenu({ guessWord, setGuessWord, handleGuess, guesses }) {
  return (
    <div>
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
  );
}

export default GuessMenu;
