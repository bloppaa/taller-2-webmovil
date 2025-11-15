import sqlite3
import json

conn = sqlite3.connect("api-fastapi/games.db")
cur = conn.cursor()

for i in range(1, 26):
    with open(f"api-fastapi/data/page_{i}.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    for game in data["results"]:
        slug = game.get("slug", "")
        name = game.get("name", "")
        released = game.get("released", "")
        rating_top = game.get("rating_top", 0)
        metacritic = game.get("metacritic", 0)
        platforms = ",".join(
            [p["platform"]["name"] for p in game.get("parent_platforms", [])]
        )
        genres = ",".join([g["name"] for g in game.get("genres", [])])

        cur.execute(
            """
            insert into games (slug, name, released, rating_top, metacritic, platforms, genres)
            values (?, ?, ?, ?, ?, ?, ?)
            """,
            (slug, name, released, rating_top, metacritic, platforms, genres),
        )

conn.commit()
conn.close()
