import { Model, DataTypes, Sequelize, Optional } from "sequelize";

export interface CategoryAttributes {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id" | "description" | "image" | "status" | "createdAt" | "updatedAt"> {}

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name!: string;
  public description!: string | null;
  public image!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Category.hasMany(models.Product, {
      foreignKey: "categoryId",
      as: "products",
    });
  }

  static initModel(sequelize: Sequelize): typeof Category {
    Category.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("active", "inactive"),
          defaultValue: "active",
        },
      },
      {
        sequelize,
        modelName: "Category",
        tableName: "Categories",
        timestamps: true,
      }
    );
    return Category;
  }
}

export default Category;
