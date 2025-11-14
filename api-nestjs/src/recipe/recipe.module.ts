import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Recipe } from './recipe.model';

@Module({
  imports: [SequelizeModule.forFeature([Recipe])],
  controllers: [RecipeController],
  providers: [RecipeService]
})
export class RecipeModule {}
