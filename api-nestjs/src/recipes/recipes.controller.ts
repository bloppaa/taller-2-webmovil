import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
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

  @Get(':id')
  fetchRecipeById(@Param('id') id: string) {
    const recipe = this.recipesService.fetchRecipeById(id);
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    return recipe;
  }
}
