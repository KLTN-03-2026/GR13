import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare Email: string;
  declare Phone: string;
  declare img: string | null;
  declare password: string;
  declare role_code: string;

  public static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        Email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        Phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        img: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role_code: {
          type: DataTypes.STRING,
          defaultValue: "R3",
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "Users",
      },
    );
    return User;
  }

  static associate(models: any) {
    User.belongsTo(models.Role, {
      foreignKey: "role_code",
      targetKey: "code",
      as: "roleData",
    });
    User.hasOne(models.Cart, {
      foreignKey: "userId",
      as: "cart",
    });
    User.hasMany(models.Order, {
      foreignKey: "userId",
      as: "orders",
    });
    User.hasMany(models.Booking, {
      foreignKey: "userId",
      as: "bookings",
    });
    User.hasMany(models.Review, {
      foreignKey: "userId",
      as: "reviews",
    });
    User.hasMany(models.Wishlist, {
      foreignKey: "userId",
      as: "wishlists",
    });
  }
}

export default User;
