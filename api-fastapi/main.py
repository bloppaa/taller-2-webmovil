import sys
import os

from fastapi import FastAPI
from routes.games import router as games_router

app = FastAPI()
app.include_router(games_router, prefix="/api")
