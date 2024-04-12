import mongoose from 'mongoose';

const gameStats = mongoose.model('gameStats', {
  userName: String,
  correctWord: String,
  useDouble: Boolean,
  wordLength: Number,
  guesses: Number,
  timer: Number,
});

export { gameStats };
