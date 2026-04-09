"use strict";

import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkInsert(
      "blogs",
      [
        {
          title: "Bài viết đầu tiên",
          slug: "bai-viet-dau-tien",
          desc: "Mô tả ngắn cho bài viết đầu tiên",
          content: "Nội dung bài viết đầu tiên",
          image: null,
          category: "Chăm sóc da",
          blog_category_id: 1,
          status: "published",
          views: 0,
          author_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true } as any,
    );
  },

  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete("blogs", {}, {});
  },
};
