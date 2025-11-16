import sqlite3
import json
from tqdm import tqdm

conn = sqlite3.connect("pokemon.db")
cur = conn.cursor()

for i in tqdm(range(1, 1026), desc="Seeding database"):
    with open(f"data/pokemon_{i}.json", "r", encoding="utf-8") as f:
        data = json.load(f)

        name = data.get("name")
        types = ",".join([t["type"]["name"] for t in data.get("types", [])])
        image = (
            data.get("sprites", {})
            .get("other", {})
            .get("official-artwork", {})
            .get("front_default")
        )

        cur.execute(
            """
            INSERT INTO pokemon (name, types, image)
            VALUES (?, ?, ?)
            """,
            (name, types, image),
        )

conn.commit()
conn.close()
