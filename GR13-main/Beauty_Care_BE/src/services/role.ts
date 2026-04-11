import db from "../models";

export const getAllRoles = async () => {
  try {
    const response = await db.Role.findAll({
      attributes: ["code", "value"],
    });
    return {
      err: 0,
      mess: "Got all roles",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

export const createRole = async (body: any) => {
  try {
    const response = await db.Role.findOrCreate({
      where: { code: body.code },
      defaults: {
        code: body.code,
        value: body.value,
      },
    });
    return {
      err: response[1] ? 0 : 1,
      mess: response[1] ? "Created role" : "Role already exists",
    };
  } catch (error) {
    throw error;
  }
};

export const updateRole = async (body: any) => {
  try {
    const response = await db.Role.update(
      { value: body.value },
      { where: { code: body.code } },
    );
    return {
      err: response[0] > 0 ? 0 : 1,
      mess: response[0] > 0 ? "Updated role" : "Failed to update role",
    };
  } catch (error) {
    throw error;
  }
};

export const deleteRole = async (code: string) => {
  try {
    const response = await db.Role.destroy({
      where: { code },
    });
    return {
      err: response > 0 ? 0 : 1,
      mess: response > 0 ? "Deleted role" : "Failed to delete role",
    };
  } catch (error) {
    throw error;
  }
};
