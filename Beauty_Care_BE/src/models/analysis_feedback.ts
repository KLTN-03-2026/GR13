import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class AnalysisFeedback extends Model<InferAttributes<AnalysisFeedback>, InferCreationAttributes<AnalysisFeedback>> {
  declare id: CreationOptional<number>;
  declare skin_analysis_id: number;
  declare accuracy_level: number;
  declare customer_feedback: string;

  public static initModel(sequelize: Sequelize) {
    AnalysisFeedback.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        skin_analysis_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        accuracy_level: {
          type: DataTypes.INTEGER,
        },
        customer_feedback: {
          type: DataTypes.TEXT,
        },
      },
      {
        sequelize,
        modelName: "AnalysisFeedback",
        tableName: "AnalysisFeedbacks",
      },
    );
    return AnalysisFeedback;
  }

  static associate(models: any) {
    AnalysisFeedback.belongsTo(models.SkinAnalysisHistory, {
      foreignKey: "skin_analysis_id",
      as: "analysis",
    });
  }
}

export default AnalysisFeedback;