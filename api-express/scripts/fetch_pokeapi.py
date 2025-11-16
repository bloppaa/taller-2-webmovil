import requests
import json
from tqdm import tqdm
import os

url = "https://pokeapi.co/api/v2/pokemon/"

os.makedirs("data", exist_ok=True)

for i in tqdm(range(1, 1026), desc="Fetching Pokémon"):
    r = requests.get(f"{url}{i}")
    data = r.json()
    filename = f"data/pokemon_{i}.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
