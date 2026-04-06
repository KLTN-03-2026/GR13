import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class Wishlist extends Model<InferAttributes<Wishlist>, InferCreationAttributes<Wishlist>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare productId: number;

  public static initModel(sequelize: Sequelize) {
    Wishlist.init(
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
        modelName: "Wishlist",
        tableName: "Wishlists",
      },
    );
    return Wishlist;
  }

  static associate(models: any) {
    Wishlist.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userData",
    });
    Wishlist.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "productData",
    });
  }
}

export default Wishlist;
