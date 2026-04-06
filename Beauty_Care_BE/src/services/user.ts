import db from "../models";

export const getAllUsers = async () => {
  try {
    const users = await db.User.findAll();
    return {
      EM: "Lấy danh sách người dùng thành công",
      EC: 0,
      DT: users,
    };
  } catch (error) {
    console.error(error);
    return {
      EM: "Lỗi hệ thống",
      EC: -1,
      DT: [],
    };
  }
};

export const getUserById = async (id: number) => {
  try {
    const user = await db.User.findByPk(id);
    if (user) {
      return {
        EM: "Lấy thông tin người dùng thành công",
        EC: 0,
        DT: user,
      };
    }
    return {
      EM: "Không tìm thấy người dùng",
      EC: 1,
      DT: null,
    };
  } catch (error) {
    console.error(error);
    return {
      EM: "Lỗi hệ thống",
      EC: -1,
      DT: null,
    };
  }
};

export const createNewUser = async (userData: any) => {
  try {
    const newUser = await db.User.create(userData);
    return {
      EM: "Tạo người dùng mới thành công",
      EC: 0,
      DT: newUser,
    };
  } catch (error: any) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return {
        EM: "Email đã tồn tại",
        EC: 1,
        DT: null,
      };
    }
    return {
      EM: "Lỗi hệ thống",
      EC: -1,
      DT: null,
    };
  }
};

export const updateUserData = async (id: number, userData: any) => {
  try {
    const user = await db.User.findByPk(id);
    if (user) {
      await user.update(userData);
      return {
        EM: "Cập nhật thông tin thành công",
        EC: 0,
        DT: user,
      };
    }
    return {
      EM: "Không tìm thấy người dùng",
      EC: 1,
      DT: null,
    };
  } catch (error) {
    console.error(error);
    return {
      EM: "Lỗi hệ thống",
      EC: -1,
      DT: null,
    };
  }
};

export const deleteUser = async (id: number) => {
  try {
    const user = await db.User.findByPk(id);
    if (user) {
      await user.destroy();
      return {
        EM: "Xóa người dùng thành công",
        EC: 0,
        DT: null,
      };
    }
    return {
      EM: "Không tìm thấy người dùng",
      EC: 1,
      DT: null,
    };
  } catch (error) {
    console.error(error);
    return {
      EM: "Lỗi hệ thống",
      EC: -1,
      DT: null,
    };
  }
};
