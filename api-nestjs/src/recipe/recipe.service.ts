import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/sequelize';
import { Recipe } from './recipe.model';

const API_CONFIG = {
  SPOONACULAR: {
    BASE_URL: "https://api.spoonacular.com/recipes",
    API_KEY: "76c335c80985436eac192d8007276bc5",
    ENDPOINTS: {
      RANDOM: "/random",
      SEARCH: "/complexSearch",
      DETAIL: "/information",
    },
  },
};

@Injectable()
export class RecipeService {
    constructor(
        @InjectModel(Recipe)
        private recipeModel,
    ) {}
}
