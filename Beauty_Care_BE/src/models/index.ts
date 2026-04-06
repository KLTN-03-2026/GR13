import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import process from "process";

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db: any = {};

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable] as string,
    config,
  );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

// Kiểm tra kết nối
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Kết nối đến cơ sở dữ liệu thành công.");
  })
  .catch((err) => {
    console.error("❌ Không thể kết nối đến cơ sở dữ liệu:", err);
  });

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.slice(-3) === ".ts" || file.slice(-3) === ".js") &&
      file.indexOf(".test.ts") === -1
    );
  })
  .forEach((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const modelDef = require(path.join(__dirname, file));
    // Lấy export default hoặc export thường
    const modelClass = modelDef.default || modelDef;

    // Kiểm tra xem có phải là Class model có hàm initModel không (Pattern hiện tại của project)
    if (modelClass && typeof modelClass.initModel === "function") {
      const model = modelClass.initModel(sequelize);
      db[model.name] = model;
    }
    // Fallback cho function pattern (Pattern từ code snippet của bạn)
    else if (typeof modelClass === "function") {
      try {
        const model = modelClass(sequelize);
        db[model.name] = model;
      } catch (e) {
        // console.warn(`File ${file} không phải là model hợp lệ.`);
      }
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
export { sequelize };
