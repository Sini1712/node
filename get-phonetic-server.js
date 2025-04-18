const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/ipa', async (req, res) => {
  const word = req.query.word;
  if (!word) return res.status(400).send('Missing "word" param');

  try {
    const url = `https://www.oxfordlearnersdictionaries.com/definition/english/${word}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const ipa = $(".phonetics .phon").first().text().trim();
    if (!ipa) return res.status(404).send('IPA not found');

    res.json({ word, ipa });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching IPA', detail: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`IPA server running at http://localhost:${PORT}`);
});
