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
  declare skin_analysis_id: number;
  declare product_id: number;
  declare morning_routine: boolean;
  declare evening_routine: boolean;

  public static initModel(sequelize: Sequelize) {
    ProductRecommendation.init(
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
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        morning_routine: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        evening_routine: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: "ProductRecommendation",
        tableName: "ProductRecommendations",
      },
    );
    return ProductRecommendation;
  }

  static associate(models: any) {
    ProductRecommendation.belongsTo(models.SkinAnalysisHistory, {
      foreignKey: "skin_analysis_id",
      as: "skinAnalysis",
    });
    ProductRecommendation.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "productData",
    });
  }
}

export default ProductRecommendation;
