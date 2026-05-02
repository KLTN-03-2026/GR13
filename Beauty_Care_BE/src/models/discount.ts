import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class Discount extends Model<InferAttributes<Discount>, InferCreationAttributes<Discount>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare code: string;
  declare description: string | null;
  declare discountValue: number;
  declare discountType: "percentage" | "fixed";
  declare minOrderValue: number;
  declare maxDiscountValue: number | null;
  declare startDate: Date;
  declare endDate: Date;
  declare usageLimit: number;
  declare usedCount: CreationOptional<number>;
  declare userUsageLimit: number;
  declare status: "active" | "inactive";

  public static initModel(sequelize: Sequelize) {
    Discount.init(
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
        code: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discountValue: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        discountType: {
          type: DataTypes.ENUM("percentage", "fixed"),
          allowNull: false,
          defaultValue: "percentage",
        },
        minOrderValue: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0,
        },
        maxDiscountValue: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        usageLimit: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 100,
        },
        usedCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        userUsageLimit: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        status: {
          type: DataTypes.ENUM("active", "inactive"),
          defaultValue: "active",
        },
      },
      {
        sequelize,
        modelName: "Discount",
        tableName: "Discounts",
      },
    );
    return Discount;
  }

  static associate(models: any) {
    Discount.hasMany(models.OrderItem, {
      foreignKey: "discountId",
      as: "orderItems",
    });
  }
}

export default Discount;
