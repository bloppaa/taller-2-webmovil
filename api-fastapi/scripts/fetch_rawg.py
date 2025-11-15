import requests
import json
from tqdm import tqdm
from dotenv import load_dotenv
import os

load_dotenv()

url = "https://api.rawg.io/api/games"
key = os.getenv("RAWG_API_KEY")
pages = 25

os.makedirs("api-fastapi/data", exist_ok=True)

for page in tqdm(range(1, pages + 1)):
    r = requests.get(url, params={"key": key, "page": page, "page_size": 40})
    data = r.json()
    filename = f"api-fastapi/data/page_{page}.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
