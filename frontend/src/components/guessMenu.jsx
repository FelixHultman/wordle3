import React from 'react';

function GuessMenu({ guessWord, setGuessWord, handleGuess, guesses }) {
  return (
    <div class='flex flex-col items-center text'>
      <label htmlFor='' class='mt-4 mr-2 px-4 py-2 rounded p-1 ml-2 text-lg'>
        <span class='text-3xl'>Write your guess:</span>
        <input
          class='rounded mr-2 ml-2 mt-4  px-4 py-2'
          type='text'
          value={guessWord}
          onChange={(e) => setGuessWord(e.target.value.toUpperCase())}
        />
        <button
          onClick={handleGuess}
          class='mt-4 mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Confirm guess
        </button>
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
