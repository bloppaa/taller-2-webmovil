import sqlite3


def fetch_games(search=None, orderby=None, limit=20):
    conn = sqlite3.connect("api-fastapi/games.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    query = "SELECT * FROM games"
    params = []

    if search:
        query += " WHERE name LIKE ?"
        params.append(f"%{search}%")

    if orderby in ["released", "metacritic"]:
        query += f" ORDER BY {orderby}"

    query += " LIMIT ?"
    params.append(limit)

    cur.execute(query, params)
    results = cur.fetchall()

    conn.close()

    return [dict(row) for row in results]
