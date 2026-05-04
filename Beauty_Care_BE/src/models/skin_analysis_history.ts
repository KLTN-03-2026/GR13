import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class SkinAnalysisHistory extends Model<InferAttributes<SkinAnalysisHistory>, InferCreationAttributes<SkinAnalysisHistory>> {
  declare id: CreationOptional<number>;
  declare user_id: number;
  declare skin_image: string;
  declare detected_skin_type: string;
  declare pore_level: string;
  declare absorption_level: string;
  declare acne_area: string;
  declare analysis_date: Date;

  public static initModel(sequelize: Sequelize) {
    SkinAnalysisHistory.init(
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
        skin_image: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        detected_skin_type: {
          type: DataTypes.STRING,
        },
        pore_level: {
          type: DataTypes.STRING,
        },
        absorption_level: {
          type: DataTypes.STRING,
        },
        acne_area: {
          type: DataTypes.STRING,
        },
        analysis_date: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: "SkinAnalysisHistory",
        tableName: "SkinAnalysisHistories",
      },
    );
    return SkinAnalysisHistory;
  }

  static associate(models: any) {
    SkinAnalysisHistory.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "userData",
    });
    SkinAnalysisHistory.hasOne(models.AnalysisFeedback, {
      foreignKey: "skin_analysis_id",
      as: "feedback",
    });
    SkinAnalysisHistory.hasMany(models.ProductRecommendation, {
      foreignKey: "skin_analysis_id",
      as: "productRecommendations",
    });
  }
}

export default SkinAnalysisHistory;