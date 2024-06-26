import express from 'express';
import cors from 'cors';
import expressHandlebars from 'express-handlebars';
import { engine } from 'express-handlebars';
import fetchWordlist from './fetchWordlist.js';
import wordFeedback from './wordFeedback.js';
import mongoose from 'mongoose';
import { gameStats } from './src/models.js';
import fs from 'fs/promises';

mongoose.connect('mongodb://127.0.0.1:27017/test');

const app = express();
const PORT = process.env.PORT || 5080;
app.use('/assets', express.static('../frontend/dist/assets'));
app.use(cors());
app.use(express.json());
app.engine('handlebars', expressHandlebars.engine());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('public'));

app.get('/', async (req, res) => {
  try {
    const html = await fs.readFile('../frontend/dist/index.html');
    res.type('html').send(html);
  } catch (error) {
    console.error('Error occurred while reading the file:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/highscore', async (req, res) => {
  try {
    const highscoreStats = await gameStats
      .find()
      .sort({ timer: 1 })
      .limit(6)
      .lean();
    res.render('highscore', { highscoreStats });
  } catch (error) {
    console.error('Error rendering highscore template:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/aboutUs', (req, res) => {
  try {
    res.render('aboutUs');
  } catch (error) {
    console.error('Error rendering highscore template:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/guessWord', (req, res) => {
  const { guessWord, correctWord } = req.body;

  if (!guessWord || !correctWord) {
    return res.status(400).json({ error: 'Not valid guess or word' });
  }

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
  try {
    const playerStat = req.body;

    const statModel = new gameStats(playerStat);
    await statModel.save();
    res.status(200).send('Stats are saved!');
  } catch (error) {
    console.error('Error occurred while saving player score:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log('Server is up');
});
