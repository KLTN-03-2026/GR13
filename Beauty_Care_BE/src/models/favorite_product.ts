import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class FavoriteProduct extends Model<InferAttributes<FavoriteProduct>, InferCreationAttributes<FavoriteProduct>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare productId: number;

  public static initModel(sequelize: Sequelize) {
    FavoriteProduct.init(
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
      },
      {
        sequelize,
        modelName: "FavoriteProduct",
        tableName: "FavoriteProducts",
      },
    );
    return FavoriteProduct;
  }

  static associate(models: any) {
    FavoriteProduct.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userData",
    });
    FavoriteProduct.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "productData",
    });
  }
}

export default FavoriteProduct;
