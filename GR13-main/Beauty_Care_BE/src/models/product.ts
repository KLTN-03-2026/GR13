import { Model, DataTypes, Sequelize, Optional } from "sequelize";

export interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  usage?: string | null;
  price: number;
  discountPrice?: number | null;
  image: string;
  images?: string | null; // JSON string
  stock: number;
  categoryId: number;
  brand?: string | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    "id" | "usage" | "discountPrice" | "images" | "stock" | "brand" | "status" | "createdAt" | "updatedAt"
  > {}

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public usage!: string | null;
  public price!: number;
  public discountPrice!: number | null;
  public image!: string;
  public images!: string | null;
  public stock!: number;
  public categoryId!: number;
  public brand!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "categoryData",
    });
    Product.hasMany(models.CartItem, {
      foreignKey: "productId",
      as: "cartItems",
    });
    Product.hasMany(models.OrderItem, {
      foreignKey: "productId",
      as: "orderItems",
    });
    Product.hasMany(models.Booking, {
      foreignKey: "productId",
      as: "bookings",
    });
    Product.hasMany(models.Review, {
      foreignKey: "productId",
      as: "reviews",
    });
    Product.hasMany(models.Wishlist, {
      foreignKey: "productId",
      as: "wishlists",
    });
  }

  static initModel(sequelize: Sequelize): typeof Product {
    Product.init(
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
          allowNull: false,
        },
        usage: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        discountPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        images: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        stock: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        categoryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        brand: {
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
        modelName: "Product",
        tableName: "Products",
        timestamps: true,
      }
    );
    return Product;
  }
}

export default Product;
