import sqlite3

conn = sqlite3.connect("games.db")
cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS games")

cur.execute(
    """
    CREATE TABLE games (
        id INTEGER PRIMARY KEY,
        slug TEXT,
        name TEXT,
        released TEXT,
        rating_top INTEGER,
        metacritic INTEGER,
        platforms TEXT,
        genres TEXT
    )
    """
)

conn.commit()
conn.close()
