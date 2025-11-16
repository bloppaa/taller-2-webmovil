import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from routes.games import router as games_router

app = FastAPI()
app.include_router(games_router, prefix="/api")
