import mongoose from 'mongoose';

const gameStats = mongoose.model('gameStats', {
  userName: String,
  useDouble: Boolean,
  wordLength: Number,
  guesses: Array,
  timer: Number,
});

export { gameStats };
