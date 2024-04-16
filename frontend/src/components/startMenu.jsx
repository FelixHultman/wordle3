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
    <menu class="flex flex-col items-center text">
      <p class='text-red-700 pb-8'>Choose your game settings and name here</p>
      <label class='pb-8'>
        Write your name here:
        <input
          type='text'
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
      </label>
      <label class='pb-8'>
        Do you want words with double letters
        <input
          type='checkbox'
          checked={useDouble}
          onChange={(e) => setUsedouble(e.target.checked)}
        ></input>
      </label>

      <label class='pb-8'>
        Choose your word length
        <select onChange={(e) => setWordLength(parseInt(e.target.value))}>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
        </select>
        </label>
        <button onClick={handleStartGame} class='border-2'>Press here to start game</button>
      
    </menu>
  );
}

export default StartMenu;
