import db from "../models";
import { Op } from "sequelize";

// --- Category Services ---

export const getAllCategories = async () => {
  try {
    const categories = await db.Category.findAll();
    return {
      EM: "Lấy danh sách danh mục thành công",
      EC: 0,
      DT: categories,
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

export const createCategory = async (data: any) => {
  try {
    const category = await db.Category.create(data);
    return {
      EM: "Tạo danh mục thành công",
      EC: 0,
      DT: category,
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

export const updateCategory = async (id: number, data: any) => {
  try {
    const category = await db.Category.findByPk(id);
    if (!category) {
      return { EM: "Không tìm thấy danh mục", EC: 1, DT: null };
    }
    await category.update(data);
    return {
      EM: "Cập nhật danh mục thành công",
      EC: 0,
      DT: category,
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

export const deleteCategory = async (id: number) => {
  try {
    const category = await db.Category.findByPk(id);
    if (!category) {
      return { EM: "Không tìm thấy danh mục", EC: 1, DT: null };
    }
    await category.destroy();
    return {
      EM: "Xóa danh mục thành công",
      EC: 0,
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

// --- Product Services ---

export const getProducts = async (query: any) => {
  try {
    const { page, limit, name, categoryId, status, brand } = query;
    const offset = page && limit ? (page - 1) * limit : 0;
    const where: any = {};

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (brand) where.brand = brand;

    const { count, rows } = await db.Product.findAndCountAll({
      where,
      limit: limit ? +limit : undefined,
      offset: offset ? +offset : undefined,
      include: [{ model: db.Category, as: "categoryData", attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });

    return {
      EM: "Lấy danh sách sản phẩm thành công",
      EC: 0,
      DT: {
        totalItems: count,
        totalPages: limit ? Math.ceil(count / limit) : 1,
        currentPage: page ? +page : 1,
        products: rows,
      },
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

export const getProductById = async (id: number) => {
  try {
    const product = await db.Product.findByPk(id, {
      include: [{ model: db.Category, as: "categoryData", attributes: ["name"] }],
    });
    if (!product) {
      return { EM: "Không tìm thấy sản phẩm", EC: 1, DT: null };
    }
    return {
      EM: "Lấy chi tiết sản phẩm thành công",
      EC: 0,
      DT: product,
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

export const createProduct = async (data: any) => {
  try {
    const product = await db.Product.create(data);
    return {
      EM: "Tạo sản phẩm thành công",
      EC: 0,
      DT: product,
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

export const updateProduct = async (id: number, data: any) => {
  try {
    const product = await db.Product.findByPk(id);
    if (!product) {
      return { EM: "Không tìm thấy sản phẩm", EC: 1, DT: null };
    }
    await product.update(data);
    return {
      EM: "Cập nhật sản phẩm thành công",
      EC: 0,
      DT: product,
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

export const deleteProduct = async (id: number) => {
  try {
    const product = await db.Product.findByPk(id);
    if (!product) {
      return { EM: "Không tìm thấy sản phẩm", EC: 1, DT: null };
    }
    await product.destroy();
    return {
      EM: "Xóa sản phẩm thành công",
      EC: 0,
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
