import db from "../models";

export const createBlogCategory = async (payload: any) => {
  try {
    const created = await db.BlogCategory.create({
      name: payload.name,
      description: payload.description,
      status: payload.status || "active",
    });

    return {
      err: 0,
      mess: "Tạo danh mục bài viết thành công",
      data: created,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Lỗi hệ thống",
    };
  }
};

export const getAllBlogCategories = async () => {
  try {
    console.log("Fetching all blog categories...");
    const categories = await db.BlogCategory.findAll();
    console.log("Found categories:", categories.length);

    return {
      err: 0,
      mess: "Lấy danh sách danh mục thành công",
      data: categories,
    };
  } catch (error) {
    console.error("Error in getAllBlogCategories:", error);
    return {
      err: 1,
      mess: "Lỗi hệ thống",
      data: [],
    };
  }
};

export const updateBlogCategory = async (id: number, payload: any) => {
  try {
    const category = await db.BlogCategory.findByPk(id);
    if (!category) {
      return {
        err: 1,
        mess: "Không tìm thấy danh mục",
      };
    }

    await category.update(payload);
    return {
      err: 0,
      mess: "Cập nhật danh mục thành công",
      data: category,
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Lỗi hệ thống",
    };
  }
};

export const deleteBlogCategory = async (id: number) => {
  try {
    const category = await db.BlogCategory.findByPk(id);
    if (!category) {
      return {
        err: 1,
        mess: "Không tìm thấy danh mục",
      };
    }

    await category.destroy();
    return {
      err: 0,
      mess: "Xóa danh mục thành công",
    };
  } catch (error) {
    console.error(error);
    return {
      err: 1,
      mess: "Lỗi hệ thống",
    };
  }
};
