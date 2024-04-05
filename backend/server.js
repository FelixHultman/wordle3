import express from 'express';
import cors from 'cors';
import fetchWordlist from './fetchWordlist.js';
import wordFeedback from './wordFeedback.js';

const app = express();
const PORT = process.env.PORT || 5080;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {});

app.post('/api/guessWord', (req, res) => {
  const { guessWord, correctWord } = req.body;

  console.log('Received guessWord:', guessWord);
  console.log('Received correctWord:', correctWord);

  if (!guessWord || !correctWord) {
    return res.status(400).json({ error: 'Not valid guess or word' });
  }
  console.log('Feedback', feedback);
  const feedback = wordFeedback(guessWord, correctWord);

  res.json(feedback);
});

app.get('/api/wordlist', async (req, res) => {
  try {
    const wordlist = await fetchWordlist();

    res.json({ wordlist });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wordlist' });
  }
});
app.post('/api/highscore', (req, res) => {});

app.listen(PORT, () => {
  console.log('Server is up');
});
