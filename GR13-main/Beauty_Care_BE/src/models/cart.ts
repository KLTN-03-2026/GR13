import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
  declare id: CreationOptional<number>;
  declare userId: number;

  public static initModel(sequelize: Sequelize) {
    Cart.init(
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
      },
      {
        sequelize,
        modelName: "Cart",
        tableName: "Carts",
      },
    );
    return Cart;
  }

  static associate(models: any) {
    Cart.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userData",
    });
    Cart.hasMany(models.CartItem, {
      foreignKey: "cartId",
      as: "cartItems",
    });
  }
}

export default Cart;
