import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtiene todas las recetas' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filtrar recetas por nombre',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número máximo de resultados',
    schema: { default: 20 },
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de recetas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
  })
  fetchRecipes(
    @Query('search') search?: string,
    @Query('limit') limit?: number,
  ) {
    return {
      recipes: this.recipesService.fetchRecipes(search, limit),
    };
  }

  @Get('random')
  @ApiOperation({ summary: 'Obtiene recetas aleatorias' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número máximo de recetas aleatorias',
    schema: { default: 5 },
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de recetas aleatorias',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
  })
  fetchRandomRecipes(@Query('limit') limit?: number) {
    return {
      recipes: this.recipesService.fetchRandomRecipes(limit),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una receta por ID' })
  @ApiParam({ name: 'id', description: 'ID de la receta', type: 'integer' })
  @ApiResponse({
    status: 200,
    description: 'Información de la receta',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Receta no encontrada' })
  fetchRecipeById(@Param('id') id: string) {
    const recipe = this.recipesService.fetchRecipeById(id);
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    return recipe;
  }
}
