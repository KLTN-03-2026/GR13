import db from "../models";
import { Op } from "sequelize";

const slugify = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const ensureUniqueSlug = async (baseSlug: string) => {
  let slug = baseSlug || "post";
  let i = 1;
  while (true) {
    const exists = await db.Blog.findOne({ where: { slug } });
    if (!exists) return slug;
    slug = `${baseSlug}-${i}`;
    i += 1;
  }
};

export const createBlog = async (payload: any, authorId?: number) => {
  try {
    const baseSlug = payload.slug ? slugify(String(payload.slug)) : slugify(String(payload.title));
    const slug = await ensureUniqueSlug(baseSlug);

    const created = await db.Blog.create({
      title: payload.title,
      slug,
      desc: payload.desc,
      content: payload.content,
      image: payload.image || null,
      category: payload.category,
      blog_category_id: payload.blog_category_id,
      status: payload.status || "draft",
      author_id: authorId ?? payload.author_id ?? null,
    });

    return {
      err: 0,
      mess: "Tạo bài viết thành công",
      data: created,
    };
  } catch (error: any) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return {
        err: 1,
        mess: "Slug đã tồn tại",
      };
    }
    throw error;
  }
};

export const getAllBlogs = async (query: any) => {
  const page = Math.max(parseInt(query?.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(query?.limit || "10", 10), 1), 50);
  const offset = (page - 1) * limit;

  const where: any = {};
  if (query?.status) where.status = query.status;
  if (query?.category) where.category = query.category;
  if (query?.q) {
    where[Op.or] = [
      { title: { [Op.like]: `%${query.q}%` } },
      { desc: { [Op.like]: `%${query.q}%` } },
    ];
  }

  const { rows, count } = await db.Blog.findAndCountAll({
    where,
    distinct: true,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: db.User,
        as: "authorData",
        attributes: ["id", "firstName", "lastName", "Email", "role_code"],
      },
      {
        model: db.BlogCategory,
        as: "blogCategoryData",
        attributes: ["id", "name"],
      },
    ],
  });

  // Map data to handle legacy category column
  const items = rows.map((blog: any) => {
    const plainBlog = blog.get({ plain: true });
    if (!plainBlog.blogCategoryData && plainBlog.category) {
      plainBlog.blogCategoryData = { name: plainBlog.category };
    }
    return plainBlog;
  });

  return {
    err: 0,
    mess: "Lấy danh sách bài viết thành công",
    data: {
      items,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    },
  };
};

export const getBlogById = async (id: number, options?: { incViews?: boolean }) => {
  const blog = await db.Blog.findByPk(id, {
    include: [
      {
        model: db.User,
        as: "authorData",
        attributes: ["id", "firstName", "lastName", "Email", "role_code"],
      },
      {
        model: db.BlogCategory,
        as: "blogCategoryData",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!blog) {
    return {
      err: 1,
      mess: "Không tìm thấy bài viết",
      data: null,
    };
  }

  const plainBlog = blog.get({ plain: true });
  if (!plainBlog.blogCategoryData && plainBlog.category) {
    plainBlog.blogCategoryData = { name: plainBlog.category };
  }

  if (options?.incViews) {
    await blog.increment("views", { by: 1 });
    // Reload if needed, but we already have the plain object
  }

  return {
    err: 0,
    mess: "Lấy bài viết thành công",
    data: plainBlog,
  };
};

export const getBlogBySlug = async (slug: string, options?: { incViews?: boolean }) => {
  const blog = await db.Blog.findOne({
    where: { slug },
    include: [
      {
        model: db.User,
        as: "authorData",
        attributes: ["id", "firstName", "lastName", "Email", "role_code"],
      },
      {
        model: db.BlogCategory,
        as: "blogCategoryData",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!blog) {
    return {
      err: 1,
      mess: "Không tìm thấy bài viết",
      data: null,
    };
  }

  const plainBlog = blog.get({ plain: true });
  if (!plainBlog.blogCategoryData && plainBlog.category) {
    plainBlog.blogCategoryData = { name: plainBlog.category };
  }

  if (options?.incViews) {
    await blog.increment("views", { by: 1 });
  }

  return {
    err: 0,
    mess: "Lấy bài viết thành công",
    data: plainBlog,
  };
};

export const updateBlog = async (id: number, payload: any, authorId?: number) => {
  const blog = await db.Blog.findByPk(id);
  if (!blog) {
    return {
      err: 1,
      mess: "Không tìm thấy bài viết",
    };
  }

  if (authorId && blog.author_id && blog.author_id !== authorId) {
    return {
      err: 1,
      mess: "Không có quyền cập nhật bài viết này",
    };
  }

  const updateData: any = { ...payload };
  if (typeof updateData.slug === "string") {
    const newBaseSlug = slugify(updateData.slug);
    if (newBaseSlug && newBaseSlug !== blog.slug) {
      updateData.slug = await ensureUniqueSlug(newBaseSlug);
    } else {
      delete updateData.slug;
    }
  }

  await blog.update(updateData);
  return {
    err: 0,
    mess: "Cập nhật bài viết thành công",
    data: blog,
  };
};

export const deleteBlog = async (id: number, authorId?: number) => {
  const blog = await db.Blog.findByPk(id);
  if (!blog) {
    return {
      err: 1,
      mess: "Không tìm thấy bài viết",
    };
  }

  if (authorId && blog.author_id && blog.author_id !== authorId) {
    return {
      err: 1,
      mess: "Không có quyền xóa bài viết này",
    };
  }

  await blog.destroy();
  return {
    err: 0,
    mess: "Xóa bài viết thành công",
  };
};
