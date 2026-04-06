import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class Review extends Model<InferAttributes<Review>, InferCreationAttributes<Review>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare productId: number;
  declare rating: number;
  declare comment: string | null;
  declare image: string | null;

  public static initModel(sequelize: Sequelize) {
    Review.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Review",
        tableName: "Reviews",
      },
    );
    return Review;
  }

  static associate(models: any) {
    Review.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userData",
    });
    Review.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "productData",
    });
  }
}

export default Review;
