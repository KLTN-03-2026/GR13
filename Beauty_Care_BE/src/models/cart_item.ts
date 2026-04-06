import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class CartItem extends Model<
  InferAttributes<CartItem>,
  InferCreationAttributes<CartItem>
> {
  declare id: CreationOptional<number>;
  declare cartId: number;
  declare productId: number;
  declare quantity: number;

  public static initModel(sequelize: Sequelize) {
    CartItem.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        cartId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        modelName: "CartItem",
        tableName: "CartItems",
      },
    );
    return CartItem;
  }

  static associate(models: any) {
    CartItem.belongsTo(models.Cart, {
      foreignKey: "cartId",
      as: "cartData",
    });
    CartItem.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "productData",
    });
  }
}

export default CartItem;
