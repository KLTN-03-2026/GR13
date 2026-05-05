import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class ProductRecommendation extends Model<InferAttributes<ProductRecommendation>, InferCreationAttributes<ProductRecommendation>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare morning_routine: string | null;
  declare evening_routine: string | null;
  declare skin_analysis_id: number | null;

  public static initModel(sequelize: Sequelize) {
    ProductRecommendation.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        morning_routine: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        evening_routine: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        skin_analysis_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "ProductRecommendation",
        tableName: "ProductRecommendations",
        timestamps: true,
      }
    );
    return ProductRecommendation;
  }

  static associate(models: any) {
    ProductRecommendation.belongsTo(models.SkinAnalysisHistory, {
      foreignKey: "skin_analysis_id",
      as: "skinAnalysisHistory",
    });

    ProductRecommendation.hasMany(models.Product, {
      foreignKey: "advice_id",
      as: "products",
    });
  }
}

export default ProductRecommendation;
