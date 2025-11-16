import { Controller, Get, Query } from '@nestjs/common';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  fetchRecipes(
    @Query('search') search?: string,
    @Query('orderby') orderby?: string,
    @Query('limit') limit?: number,
  ) {
    return {
      recipes: this.recipesService.fetchRecipes(search, orderby, limit),
    };
  }
}
