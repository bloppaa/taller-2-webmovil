import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Recipe } from './recipe/recipe.model';
import { RecipeModule } from './recipe/recipe.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: ':memory:',
      autoLoadModels: true,
      synchronize: true,
      models: [Recipe],
    }),
    RecipeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
