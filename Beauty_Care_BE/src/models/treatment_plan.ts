import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class TreatmentPlan extends Model<InferAttributes<TreatmentPlan>, InferCreationAttributes<TreatmentPlan>> {
  declare id: CreationOptional<number>;
  declare user_id: number;
  declare plan_name: string;
  declare start_date: Date;
  declare end_date: Date;
  declare status: string;

  public static initModel(sequelize: Sequelize) {
    TreatmentPlan.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        plan_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        start_date: {
          type: DataTypes.DATE,
        },
        end_date: {
          type: DataTypes.DATE,
        },
        status: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: "TreatmentPlan",
        tableName: "TreatmentPlans",
      },
    );
    return TreatmentPlan;
  }

  static associate(models: any) {
    TreatmentPlan.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "userData",
    });
    TreatmentPlan.hasMany(models.TreatmentPlanDetail, {
      foreignKey: "plan_id",
      as: "details",
    });
  }
}

export default TreatmentPlan;