import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class Conversation extends Model<InferAttributes<Conversation>, InferCreationAttributes<Conversation>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare expertId: number;
  declare topic: string | null;

  public static initModel(sequelize: Sequelize) {
    Conversation.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        expertId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        topic: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: "Conversation",
        tableName: "Conversations",
      },
    );
    return Conversation;
  }

  static associate(models: any) {
    Conversation.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userData",
    });
    Conversation.belongsTo(models.User, {
      foreignKey: "expertId",
      as: "expertData",
    });
    Conversation.hasMany(models.Message, {
      foreignKey: "conversation_id",
      as: "messages",
    });
  }
}

export default Conversation;