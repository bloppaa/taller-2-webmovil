import sqlite3

conn = sqlite3.connect("api-fastapi/games.db")
cur = conn.cursor()

cur.execute("drop table if exists games")

cur.execute(
    """
    create table games (
        id integer primary key,
        slug text,
        name text,
        released text,
        rating_top integer,
        metacritic integer,
        platforms text,
        genres text
    )
    """
)

conn.commit()
conn.close()
