import sqlite3
import json

conn = sqlite3.connect("recipes.db")
cur = conn.cursor()

for i in range(1, 11):
    with open(f"data/page_{i}.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    for recipe in data["recipes"]:
        title = recipe.get("title", "")
        readyInMinutes = recipe.get("readyInMinutes", 0)
        servings = recipe.get("servings", 0)
        dishTypes = ",".join(recipe.get("dishTypes", []))
        pricePerServing = recipe.get("pricePerServing", 0.0)
        spoonacularScore = recipe.get("spoonacularScore", 0.0)
        summary = recipe.get("summary", "")
        ingredients = "@".join(
            ing["original"] for ing in recipe.get("extendedIngredients", [])
        )
        instructions = recipe.get("instructions", "")
        image = recipe.get("image", "")

        cur.execute(
            """
            INSERT INTO recipes (
                title, readyInMinutes, servings, dishTypes,
                pricePerServing, spoonacularScore, summary,
                ingredients, instructions, image
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                title,
                readyInMinutes,
                servings,
                dishTypes,
                pricePerServing,
                spoonacularScore,
                summary,
                ingredients,
                instructions,
                image,
            ),
        )

conn.commit()
conn.close()
