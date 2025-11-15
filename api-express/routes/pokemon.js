const express = require('express');
const axios = require('axios');
const router = express.Router();

const cache = new Map();
const TTL_MS = 60 * 1000; // duracion del cache en milisegundos

function setCache(key, value) {
  cache.set(key, { value, ts: Date.now() });
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}


router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '20', 10);
    const offset = parseInt(req.query.offset || '0', 10);
    const cacheKey = `list:${limit}:${offset}`;

    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    //Lista de pokemon 
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const r = await axios.get(url);

    const data = {
      count: r.data.count,
      next: r.data.next,
      previous: r.data.previous,
      results: r.data.results.map(p => ({ name: p.name, url: p.url }))
    };
    setCache(cacheKey, data);
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch pokemon list' });
  }
});

router.get('/:idOrName', async (req, res) => {
  try {
    const idOrName = req.params.idOrName.toLowerCase();
    const cacheKey = `pokemon:${idOrName}`;

    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    //detalle completo de un pokemon
    const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(idOrName)}`;
    const r = await axios.get(url);
    const p = r.data;

    
    const out = {
      id: p.id,
      name: p.name,
      height: p.height,
      weight: p.weight,
      types: p.types.map(t => t.type.name),
      abilities: p.abilities.map(a => a.ability.name),
      stats: p.stats.map(s => ({ name: s.stat.name, base: s.base_stat })),
      sprites: p.sprites
    };
    setCache(cacheKey, out);
    res.json(out);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch pokemon' });
  }
});

module.exports = router;
