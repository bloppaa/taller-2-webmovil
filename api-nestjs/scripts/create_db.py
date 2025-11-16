import sqlite3

conn = sqlite3.connect("recipes.db")
cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS recipes")

cur.execute(
    """
    CREATE TABLE recipes (
        id INTEGER PRIMARY KEY,
        title TEXT,
        readyInMinutes INTEGER,
        servings INTEGER,
        dishTypes TEXT,
        pricePerServing REAL,
        spoonacularScore REAL,
        summary TEXT,
        ingredients TEXT,
        instructions TEXT
    )
    """
)

conn.commit()
conn.close()
