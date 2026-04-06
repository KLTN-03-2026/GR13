import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare totalAmount: number;
  declare status: "pending" | "paid" | "shipping" | "completed" | "cancelled";
  declare paymentMethod: string;
  declare shippingAddress: string;
  declare phone: string;

  public static initModel(sequelize: Sequelize) {
    Order.init(
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
        totalAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM("pending", "paid", "shipping", "completed", "cancelled"),
          defaultValue: "pending",
        },
        paymentMethod: {
          type: DataTypes.STRING,
          defaultValue: "COD",
        },
        shippingAddress: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Order",
        tableName: "Orders",
      },
    );
    return Order;
  }

  static associate(models: any) {
    Order.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userData",
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: "orderId",
      as: "orderItems",
    });
  }
}

export default Order;
