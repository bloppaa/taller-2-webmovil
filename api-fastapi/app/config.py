import os
from dotenv import load_dotenv

load_dotenv()

RAWG_API_KEY = os.getenv("RAWG_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///games.db")
RAWG_BASE_URL = "https://api.rawg.io/api"