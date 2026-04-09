import { Model, DataTypes, Sequelize, Optional } from "sequelize";

export interface BlogCategoryAttributes {
  id: number;
  name: string;
  description?: string | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogCategoryCreationAttributes
  extends Optional<BlogCategoryAttributes, "id" | "description" | "status" | "createdAt" | "updatedAt"> {}

class BlogCategory
  extends Model<BlogCategoryAttributes, BlogCategoryCreationAttributes>
  implements BlogCategoryAttributes
{
  public id!: number;
  public name!: string;
  public description!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    BlogCategory.hasMany(models.Blog, {
      foreignKey: "blog_category_id",
      as: "blogs",
    });
  }

  static initModel(sequelize: Sequelize): typeof BlogCategory {
    BlogCategory.init(
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
        status: {
          type: DataTypes.ENUM("active", "inactive"),
          defaultValue: "active",
        },
      },
      {
        sequelize,
        modelName: "BlogCategory",
        tableName: "blog_categories",
        timestamps: true,
        underscored: true,
      }
    );
    return BlogCategory;
  }
}

export default BlogCategory;
