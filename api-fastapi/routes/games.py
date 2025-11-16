from fastapi import APIRouter, Query
from typing import Optional
from database.queries import fetch_games

router = APIRouter()


@router.get("/games")
def get_games(
    search: Optional[str] = Query(None, description="Search term for game names"),
    orderby: Optional[str] = Query(
        None, description="Order by 'released' or 'metacritic'"
    ),
    limit: int = Query(20, description="Number of results to return"),
):
    """
    Retrieve a list of games from the database with optional search and ordering.

    Parameters:
    - **search**: (Optional) Filter games by name containing this term.
    - **orderby**: (Optional) Order results by 'released' date or 'metacritic' score
    - **limit**: (Optional) Maximum number of results to return (default: 20).

    Returns:
    A dictionary with the key "games", containing a list of games.
    """
    games = fetch_games(search=search, orderby=orderby, limit=limit)
    return {"games": games}
