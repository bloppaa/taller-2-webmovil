import sqlite3

conn = sqlite3.connect("pokemon.db")
cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS pokemon")

cur.execute(
    """
    CREATE TABLE pokemon (
        id INTEGER PRIMARY KEY,
        name TEXT,
        types TEXT,
        image TEXT
    )
    """
)

conn.commit()
conn.close()
