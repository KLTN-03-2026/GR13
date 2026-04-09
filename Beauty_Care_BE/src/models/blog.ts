import { Model, DataTypes, Sequelize, Optional } from "sequelize";

export interface BlogAttributes {
  id: number;
  title: string;
  slug: string;
  desc: string;
  content: string;
  image?: string | null;
  category?: string | null;
  blog_category_id?: number | null;
  status: "draft" | "published" | "archived";
  views: number;
  author_id?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogCreationAttributes
  extends Optional<
    BlogAttributes,
    | "id"
    | "image"
    | "category"
    | "blog_category_id"
    | "status"
    | "views"
    | "author_id"
    | "createdAt"
    | "updatedAt"
  > {}

class Blog
  extends Model<BlogAttributes, BlogCreationAttributes>
  implements BlogAttributes
{
  public id!: number;
  public title!: string;
  public slug!: string;
  public desc!: string;
  public content!: string;
  public image!: string | null;
  public category!: string | null;
  public blog_category_id!: number | null;
  public status!: "draft" | "published" | "archived";
  public views!: number;
  public author_id!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Blog.belongsTo(models.User, {
      foreignKey: "author_id",
      as: "authorData",
    });
    Blog.belongsTo(models.BlogCategory, {
      foreignKey: "blog_category_id",
      as: "blogCategoryData",
    });
  }

  static initModel(sequelize: Sequelize): typeof Blog {
    Blog.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        desc: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT("long"),
          allowNull: false,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        category: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        blog_category_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("draft", "published", "archived"),
          defaultValue: "draft",
        },
        views: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        author_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Blog",
        tableName: "blogs",
        timestamps: true,
        underscored: true,
      },
    );
    return Blog;
  }
}

export default Blog;
