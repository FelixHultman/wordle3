import React from 'react';

function StartMenu({
  userName,
  setUserName,
  useDouble,
  setUsedouble,
  wordLength,
  setWordLength,
  handleStartGame,
}) {
  return (
    <menu class='flex flex-col items-center  bg-gradient-to-tr from-green-300 to-blue-700 rounded p-12'>
      <p class='pb-8'>Choose your game settings and name here</p>
      <label class='pb-8'>
        Write your name here:
        <input
          class='rounded mr-2 ml-2'
          type='text'
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
      </label>
      <label class='pb-8'>
        Do you want words with double letters
        <input
          class='ml-2 cursor-pointer'
          type='checkbox'
          checked={useDouble}
          onChange={(e) => setUsedouble(e.target.checked)}
        ></input>
      </label>

      <label class='mb-8'>
        Choose your word length:
        <select
          class='rounded p-1 ml-2 cursor-pointer'
          onChange={(e) => setWordLength(parseInt(e.target.value))}
        >
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
        </select>
      </label>
      <button
        onClick={handleStartGame}
        class='mt-4 mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
      >
        Press here to start game
      </button>
    </menu>
  );
}

export default StartMenu;
