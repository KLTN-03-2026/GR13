import db from "../models";

export const getAllUsers = async () => {
  try {
    const users = await db.User.findAll();
    return {
      err: 0,
      mess: "Lấy danh sách người dùng thành công",
      data: users,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Lỗi hệ thống",
      data: [],
    };
  }
};

export const getUserById = async (id: number) => {
  try {
    const user = await db.User.findByPk(id);
    if (user) {
      return {
        err: 0,
        mess: "Lấy thông tin người dùng thành công",
        data: user,
      };
    }
    return {
      err: 1,
      mess: "Không tìm thấy người dùng",
      data: null,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Lỗi hệ thống",
      data: null,
    };
  }
};

export const createNewUser = async (userData: any) => {
  try {
    const newUser = await db.User.create(userData);
    return {
      err: 0,
      mess: "Tạo người dùng mới thành công",
      data: newUser,
    };
  } catch (error: any) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return {
        err: 1,
        mess: "Email đã tồn tại",
        data: null,
      };
    }
    return {
      err: 1,
      mess: "Lỗi hệ thống",
      data: null,
    };
  }
};

export const updateUserData = async (id: number, userData: any) => {
  try {
    const user = await db.User.findByPk(id);
    if (user) {
      await user.update(userData);
      return {
        err: 0,
        mess: "Cập nhật thông tin thành công",
        data: user,
      };
    }
    return {
      err: 1,
      mess: "Không tìm thấy người dùng",
      data: null,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Lỗi hệ thống",
      data: null,
    };
  }
};

export const deleteUser = async (id: number) => {
  try {
    const user = await db.User.findByPk(id);
    if (user) {
      await user.destroy();
      return {
        err: 0,
        mess: "Xóa người dùng thành công",
        data: null,
      };
    }
    return {
      err: 1,
      mess: "Không tìm thấy người dùng",
      data: null,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Lỗi hệ thống",
      data: null,
    };
  }
};
