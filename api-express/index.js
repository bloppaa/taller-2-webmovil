const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const pokemonRouter = require('./routes/pokemon');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, api: 'api-express-pokemon' });
});

app.use('/pokemon', pokemonRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`api-express-pokemon listening on http://localhost:${port}`);
});
