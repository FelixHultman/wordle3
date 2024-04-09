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
  );
}

export default StartMenu;
