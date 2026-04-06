import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class Staff extends Model<InferAttributes<Staff>, InferCreationAttributes<Staff>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare specialty: string | null;
  declare image: string | null;
  declare status: "active" | "inactive";

  public static initModel(sequelize: Sequelize) {
    Staff.init(
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
        specialty: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        image: {
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
        modelName: "Staff",
        tableName: "Staffs",
      },
    );
    return Staff;
  }

  static associate(models: any) {
    Staff.hasMany(models.Booking, {
      foreignKey: "staffId",
      as: "bookings",
    });
  }
}

export default Staff;
