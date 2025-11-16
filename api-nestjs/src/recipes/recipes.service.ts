import { Injectable } from '@nestjs/common';
import Database from 'better-sqlite3';

@Injectable()
export class RecipesService {
  private db: Database;

  constructor() {
    this.db = new Database('recipes.db', { verbose: console.log });
  }

  fetchRecipes(search?: string, orderby?: string, limit: number = 20): any[] {
    let query = 'SELECT * FROM recipes';
    const params: any[] = [];

    if (search) {
      query += ' WHERE name LIKE ?';
      params.push(`%${search}%`);
    }

    if (orderby) {
      query += ` ORDER BY ${orderby}`;
    }

    query += ' LIMIT ?';
    params.push(limit);

    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }
}
