import db from "../models";
import { Op } from "sequelize";

// --- Category Services ---

export const getAllCategories = async () => {
  try {
    const categories = await db.Category.findAll({
      attributes: {
        include: [
          [
            db.sequelize.literal(`(
              SELECT COUNT(*)
              FROM Products AS product
              WHERE product.categoryId = Category.id
            )`),
            "productsCount",
          ],
          [
            db.sequelize.literal(`(
              SELECT COALESCE(SUM(oi.quantity), 0)
              FROM Products AS p
              JOIN OrderItems AS oi ON p.id = oi.productId
              WHERE p.categoryId = Category.id
            )`),
            "soldQty",
          ],
        ],
      },
    });
    return {
      err: 0,
      mess: "Lấy danh sách danh mục thành công",
      data: categories,
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

export const createCategory = async (data: any) => {
  try {
    const category = await db.Category.create(data);
    return {
      err: 0,
      mess: "Tạo danh mục thành công",
      data: category,
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

export const updateCategory = async (id: number, data: any) => {
  try {
    const category = await db.Category.findByPk(id);
    if (!category) {
      return { err: 1, mess: "Không tìm thấy danh mục", data: null };
    }
    await category.update(data);
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
      data: null,
    };
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const category = await db.Category.findByPk(id);
    if (!category) {
      return { err: 1, mess: "Không tìm thấy danh mục", data: null };
    }
    await category.destroy();
    return {
      err: 0,
      mess: "Xóa danh mục thành công",
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

// --- Product Services ---

export const getProducts = async (query: any) => {
  try {
    const { page, limit, name, categoryId, status, brand } = query;
    const _page = page ? +page : 1;
    const _limit = limit ? +limit : 0;
    const offset = _limit ? (_page - 1) * _limit : 0;
    const where: any = {};

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (brand) where.brand = brand;

    const { count, rows } = await db.Product.findAndCountAll({
      where,
      distinct: true,
      limit: _limit || undefined,
      offset: offset || undefined,
      include: [{ model: db.Category, as: "categoryData", attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });

    return {
      err: 0,
      mess: "Lấy danh sách sản phẩm thành công",
      data: rows,
      meta: {
        page: _page,
        limit: _limit || count,
        total: count,
      },
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

export const getProductById = async (id: number) => {
  try {
    const product = await db.Product.findByPk(id, {
      include: [{ model: db.Category, as: "categoryData", attributes: ["name"] }],
    });
    if (!product) {
      return { err: 1, mess: "Không tìm thấy sản phẩm", data: null };
    }
    return {
      err: 0,
      mess: "Lấy chi tiết sản phẩm thành công",
      data: product,
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

export const createProduct = async (data: any) => {
  try {
    const product = await db.Product.create(data);
    return {
      err: 0,
      mess: "Tạo sản phẩm thành công",
      data: product,
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

export const updateProduct = async (id: number, data: any) => {
  try {
    const product = await db.Product.findByPk(id);
    if (!product) {
      return { err: 1, mess: "Không tìm thấy sản phẩm", data: null };
    }
    await product.update(data);
    return {
      err: 0,
      mess: "Cập nhật sản phẩm thành công",
      data: product,
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

export const deleteProduct = async (id: number) => {
  try {
    const product = await db.Product.findByPk(id);
    if (!product) {
      return { err: 1, mess: "Không tìm thấy sản phẩm", data: null };
    }
    await product.destroy();
    return {
      err: 0,
      mess: "Xóa sản phẩm thành công",
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
