import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class OrderItem extends Model<
  InferAttributes<OrderItem>,
  InferCreationAttributes<OrderItem>
> {
  declare id: CreationOptional<number>;
  declare orderId: number;
  declare productId: number;
  declare quantity: number;
  declare price: number;
  declare discountId: number | null;

  public static initModel(sequelize: Sequelize) {
    OrderItem.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        discountId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "OrderItem",
        tableName: "OrderItems",
      },
    );
    return OrderItem;
  }

  static associate(models: any) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "orderData",
    });
    OrderItem.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "productData",
    });
    OrderItem.belongsTo(models.Discount, {
      foreignKey: "discountId",
      as: "discountData",
    });
  }
}

export default OrderItem;
