import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class TreatmentPlanDetail extends Model<InferAttributes<TreatmentPlanDetail>, InferCreationAttributes<TreatmentPlanDetail>> {
  declare id: CreationOptional<number>;
  declare plan_id: number;
  declare session_day: string;
  declare step_order: number;
  declare product_id: number;

  public static initModel(sequelize: Sequelize) {
    TreatmentPlanDetail.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        plan_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        session_day: {
          type: DataTypes.STRING,
        },
        step_order: {
          type: DataTypes.INTEGER,
        },
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "TreatmentPlanDetail",
        tableName: "TreatmentPlanDetails",
      },
    );
    return TreatmentPlanDetail;
  }

  static associate(models: any) {
    TreatmentPlanDetail.belongsTo(models.TreatmentPlan, {
      foreignKey: "plan_id",
      as: "plan",
    });
    TreatmentPlanDetail.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });
  }
}

export default TreatmentPlanDetail;