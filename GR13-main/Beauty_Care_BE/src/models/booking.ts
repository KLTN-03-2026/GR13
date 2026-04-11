import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class Booking extends Model<InferAttributes<Booking>, InferCreationAttributes<Booking>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare productId: number;
  declare staffId: number | null;
  declare bookingDate: string;
  declare startTime: string;
  declare endTime: string | null;
  declare status: "pending" | "confirmed" | "completed" | "cancelled";
  declare notes: string | null;

  public static initModel(sequelize: Sequelize) {
    Booking.init(
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
        staffId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        bookingDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        startTime: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        endTime: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
          defaultValue: "pending",
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Booking",
        tableName: "Bookings",
      },
    );
    return Booking;
  }

  static associate(models: any) {
    Booking.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userData",
    });
    Booking.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "serviceData",
    });
    Booking.belongsTo(models.Staff, {
      foreignKey: "staffId",
      as: "staffData",
    });
  }
}

export default Booking;
