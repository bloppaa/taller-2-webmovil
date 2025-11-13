from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Game(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    rawg_id: int = Field(index=True)
    name: str = Field(index=True)
    slug: Optional[str]
    released: Optional[str]
    rating: Optional[float]
    rating_top: Optional[int]
    ratings_count: Optional[int]
    background_image: Optional[str]
    genres: Optional[str]
    platforms: Optional[str]
    stores: Optional[str]
    tags: Optional[str]
    short_screenshots: Optional[str]
    searched_at: datetime = Field(default_factory=datetime.now)

class SearchHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    query: str
    genre: Optional[str]
    platform: Optional[str]
    results_count: int
    searched_at: datetime = Field(default_factory=datetime.now)