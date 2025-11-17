import { Injectable } from '@nestjs/common';
import Database from 'better-sqlite3';

@Injectable()
export class RecipesService {
  private db: Database;

  constructor() {
    this.db = new Database('recipes.db', { verbose: console.log });
  }

  private fixImageExtension(recipe: any): any {
    if (recipe.image && recipe.image.endsWith('.')) {
      recipe.image += 'jpg';
    }
    return recipe;
  }

  fetchRecipes(search?: string, limit: number = 20): any[] {
    let query = 'SELECT * FROM recipes';
    const params: any[] = [];

    if (search) {
      query += ' WHERE title LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' LIMIT ?';
    params.push(limit);

    const stmt = this.db.prepare(query);
    const recipes = stmt.all(...params);

    return recipes.map(this.fixImageExtension);
  }

  fetchRandomRecipes(limit: number = 20): any[] {
    const query = 'SELECT * FROM recipes ORDER BY RANDOM() LIMIT ?';
    const stmt = this.db.prepare(query);
    const recipes = stmt.all(limit);
    return recipes.map(this.fixImageExtension);
  }

  fetchRecipeById(id: string): any {
    const query = 'SELECT * FROM recipes WHERE id = ?';
    const stmt = this.db.prepare(query);
    const recipe = stmt.get(id);
    return this.fixImageExtension(recipe);
  }
}
