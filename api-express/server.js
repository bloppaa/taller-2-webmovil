const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 8080;

const db = new sqlite3.Database("pokemon.db", (err) => {
  if (err) {
    console.error("Could not connect to database", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

app.use(express.json());

app.get("/api/pokemon", (req, res) => {
  const { search, limit = 20, offset = 0 } = req.query;

  let query = "SELECT * FROM pokemon";
  const params = [];

  if (search) {
    query += " WHERE name LIKE ?";
    params.push(`%${search}%`);
  }

  query += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

app.get("/api/pokemon/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM pokemon WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Pokemon not found" });
      return;
    }
    res.json({ data: row });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
