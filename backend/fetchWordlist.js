async function fetchWordlist() {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json'
    );

    if (!response.ok) {
      throw new Error('Failed to get Words');
    }

    const words = await response.json();

    const wordlist = Object.keys(words).filter(
      (word) => word.length >= 4 && word.length <= 6
    );
    return wordlist;
  } catch (error) {
    console.error('Errors fetching the words', error);
    throw new Error('Failed to fetch word list');
  }
}

export default fetchWordlist;
