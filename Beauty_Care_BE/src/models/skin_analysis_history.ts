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
  declare acne_score: number;
  declare blackheads_score: number;
  declare dark_spots_score: number;
  declare pores_score: number;
  declare wrinkles_score: number;
  declare overall_score: number;
  declare advice_id: number;
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
        acne_score: {
          type: DataTypes.INTEGER,
        },
        blackheads_score: {
          type: DataTypes.INTEGER,
        },
        dark_spots_score: {
          type: DataTypes.INTEGER,
        },
        pores_score: {
          type: DataTypes.INTEGER,
        },
        wrinkles_score: {
          type: DataTypes.INTEGER,
        },
        overall_score: {
          type: DataTypes.INTEGER,
        },
        advice_id: {
          type: DataTypes.INTEGER,
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
    SkinAnalysisHistory.belongsTo(models.ProductRecommendation, {
      foreignKey: "advice_id",
      as: "advice",
    });
  }
}

export default SkinAnalysisHistory;