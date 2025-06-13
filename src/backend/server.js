
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());

const ODDS_API_KEY = process.env.ODDS_API_KEY;

app.get('/odds', async (req, res) => {
  try {
    const response = await axios.get('https://api.the-odds-api.com/v4/sports/soccer_epl/odds', {
      params: {
        apiKey: ODDS_API_KEY,
        regions: 'eu',
        markets: 'h2h',
        oddsFormat: 'decimal'
      }
    });
    const proximas = response.data.filter(jogo =>
      jogo.bookmakers.some(bm =>
        bm.markets.some(mk =>
          mk.outcomes.some(out => out.price >= 1.45 && out.price <= 1.55)
        )
      )
    );
    res.json(proximas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar odds" });
  }
});

app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));
