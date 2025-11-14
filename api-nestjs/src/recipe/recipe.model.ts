import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Recipe extends Model {
  @Column
  title;
}
