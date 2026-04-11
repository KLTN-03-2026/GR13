"use strict";

import { Model, DataTypes, Sequelize } from "sequelize";

interface RoleAttributes {
  id?: number;
  code: string;
  value: string;
}

export default (sequelize: Sequelize) => {
  class Role extends Model<RoleAttributes> implements RoleAttributes {
    id!: number;
    code!: string;
    value!: string;

    static associate(models: any) {
      // define association here
      Role.hasMany(models.User, {
        foreignKey: "role_code",
        sourceKey: "code",
        as: "userData",
      });
    }
  }
  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Role",
    },
  );
  return Role;
};
