import express from 'express';
import cors from 'cors';
import { engine } from 'express-handlebars';
import fetchWordlist from './fetchWordlist.js';
import wordFeedback from './wordFeedback.js';
import mongoose from 'mongoose';
import { gameStats } from './src/models.js';

mongoose.connect('mongodb://127.0.0.1:27017/test');

const app = express();
const PORT = process.env.PORT || 5080;
app.use(cors());
app.use(express.json());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/api/highscore', (req, res) => {
  try {
    res.render('highscore');
  } catch (error) {
    console.error('Error rendering highscore template:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', async (req, res) => {});

app.post('/api/guessWord', (req, res) => {
  const { guessWord, correctWord } = req.body;

  console.log('Received guessWord:', guessWord);
  console.log('Received correctWord:', correctWord);

  if (!guessWord || !correctWord) {
    return res.status(400).json({ error: 'Not valid guess or word' });
  }

  const feedback = wordFeedback(guessWord, correctWord);
  console.log('Feedback', feedback);

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

app.get('/api/gameStat', async (req, res) => {
  try {
    const stats = await gameStats.find();
    res.json({ stats });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/gameStat', async (req, res) => {
  const statData = req.body;
  console.log(req.body);

  const statModel = new gameStats(statData);
  await statModel.save();
});

app.listen(PORT, () => {
  console.log('Server is up');
});
