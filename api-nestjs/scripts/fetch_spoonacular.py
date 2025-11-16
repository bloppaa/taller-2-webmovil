import requests
import json
from tqdm import tqdm
from dotenv import load_dotenv
import os

load_dotenv()

url = "https://api.spoonacular.com/recipes/random"
key = os.getenv("SPOONACULAR_API_KEY")

os.makedirs("data", exist_ok=True)

for i in tqdm(range(1, 11)):
    r = requests.get(url, params={"apiKey": key, "number": 100})
    data = r.json()
    filename = f"data/page_{i}.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
