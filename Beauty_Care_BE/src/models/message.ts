import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
  declare id: CreationOptional<number>;
  declare conversation_id: number;
  declare sender_id: number;
  declare message_type: "text" | "image" | "file" | "sticker";
  declare content: string;
  declare is_read: boolean;

  public static initModel(sequelize: Sequelize) {
    Message.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        conversation_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        sender_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        message_type: {
          type: DataTypes.ENUM("text", "image", "file", "sticker"),
          defaultValue: "text",
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        is_read: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: "Message",
        tableName: "Messages",
      },
    );
    return Message;
  }

  static associate(models: any) {
    Message.belongsTo(models.Conversation, {
      foreignKey: "conversation_id",
      as: "conversation",
    });
    Message.belongsTo(models.User, {
      foreignKey: "sender_id",
      as: "sender",
    });
  }
}

export default Message;