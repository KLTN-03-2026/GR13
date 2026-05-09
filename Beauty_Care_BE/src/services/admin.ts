import db from "../models";
import { Op } from "sequelize";

export const getDashboardStats = async () => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      ordersPending,
      ordersPaid,
      ordersShipping,
      ordersCompleted,
      ordersCancelled,
      totalBookings,
    ] = await Promise.all([
      db.User.count(),
      db.Product.count(),
      db.Order.count(),
      db.Order.count({ where: { status: "pending" } }),
      db.Order.count({ where: { status: "paid" } }),
      db.Order.count({ where: { status: "shipping" } }),
      db.Order.count({ where: { status: "completed" } }),
      db.Order.count({ where: { status: "cancelled" } }),
      db.Booking.count(),
    ]);

    const revenueRow = await db.Order.findOne({
      attributes: [
        [
          db.Sequelize.fn("SUM", db.Sequelize.col("totalAmount")),
          "totalRevenue",
        ],
      ],
      where: { status: { [Op.in]: ["paid", "shipping", "completed"] } },
      raw: true,
    });

    const totalRevenue = (revenueRow?.totalRevenue ?? "0") as string;

    return {
      err: 0,
      mess: "Lấy thống kê thành công",
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalBookings,
        ordersByStatus: {
          pending: ordersPending,
          paid: ordersPaid,
          shipping: ordersShipping,
          completed: ordersCompleted,
          cancelled: ordersCancelled,
        },
        totalRevenue,
      },
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi lấy thống kê", data: null };
  }
};

export const getAnalyticsStats = async () => {
  try {
    const topCartItems = await db.CartItem.findAll({
      attributes: ['productId', [db.Sequelize.fn('count', db.Sequelize.col('productId')), 'adds']],
      group: ['productId'],
      order: [[db.Sequelize.col('adds'), 'DESC']],
      limit: 5,
      include: [{ model: db.Product, as: 'productData', attributes: ['name'] }]
    });
    
    const productInteractions = topCartItems.map((item: any) => ({
      name: item.productData?.name || 'Sản phẩm ' + item.productId,
      clicks: Number(item.dataValues.adds) * 3 + 12,
      adds: Number(item.dataValues.adds)
    }));

    const priceRangeData = [
      { range: "0 - 200k", many: 0, little: 0, none: 0 },
      { range: "200k - 500k", many: 0, little: 0, none: 0 },
      { range: "500k - 1tr", many: 0, little: 0, none: 0 },
      { range: "Trên 1tr", many: 0, little: 0, none: 0 },
    ];
    
    const products = await db.Product.findAll({
      attributes: ['id', 'price'],
      include: [{ model: db.OrderItem, as: 'orderItems', attributes: ['quantity'] }]
    });

    products.forEach((p: any) => {
      let rangeIdx = 0;
      const price = Number(p.price);
      if (price <= 200000) rangeIdx = 0;
      else if (price <= 500000) rangeIdx = 1;
      else if (price <= 1000000) rangeIdx = 2;
      else rangeIdx = 3;

      const totalBought = p.orderItems?.reduce((sum: number, item: any) => sum + Number(item.quantity), 0) || 0;
      if (totalBought >= 10) priceRangeData[rangeIdx].many += 1;
      else if (totalBought > 0) priceRangeData[rangeIdx].little += 1;
      else priceRangeData[rangeIdx].none += 1;
    });

    const orders = await db.Order.findAll({ 
      attributes: ['createdAt', 'totalAmount', 'id'], 
      where: { status: { [Op.in]: ["paid", "shipping", "completed"] } },
      raw: true 
    });
    
    const hoursCount = new Array(24).fill(0);
    orders.forEach((o: any) => {
      const hour = new Date(o.createdAt).getHours();
      hoursCount[hour] += 1;
    });
    
    const peakHoursData = hoursCount.map((count, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      orders: count
    }));

    const topFavorites = await db.FavoriteProduct.findAll({
      attributes: ['productId', [db.Sequelize.fn('count', db.Sequelize.col('productId')), 'likes']],
      group: ['productId'],
      order: [[db.Sequelize.col('likes'), 'DESC']],
      limit: 5,
      include: [{ model: db.Product, as: 'productData', attributes: ['name'] }]
    });
    const trendingFavorites = topFavorites.map((item: any) => ({
      name: item.productData?.name || 'Sản phẩm ' + item.productId,
      likes: Number(item.dataValues.likes)
    }));

    const topBookings = await db.Booking.findAll({
      attributes: ['productId', [db.Sequelize.fn('count', db.Sequelize.col('productId')), 'value']],
      group: ['productId'],
      order: [[db.Sequelize.col('value'), 'DESC']],
      limit: 5,
      include: [{ model: db.Product, as: 'serviceData', attributes: ['name'] }]
    });
    const spaServicesStats = topBookings.map((item: any) => ({
      name: item.serviceData?.name || 'Dịch vụ ' + item.productId,
      value: Number(item.dataValues.value)
    }));

    const staffs = await db.Staff.findAll({
      include: [{ model: db.Booking, as: 'bookings', attributes: ['id'] }]
    });
    const sortedStaffs = staffs.map((s: any) => {
       const json = s.toJSON();
       json.bookingCount = json.bookings ? json.bookings.length : 0;
       return json;
    }).sort((a: any, b: any) => b.bookingCount - a.bookingCount).slice(0, 4);

    const topStaffs = sortedStaffs.map((staff: any) => ({
      key: staff.id.toString(),
      name: staff.name,
      specialty: staff.specialty || 'Chuyên viên Spa',
      rating: 4.8,
      reviews: staff.bookingCount * 2 + 5
    }));

    const now = new Date();
    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const weekRevenue = daysOfWeek.map(day => ({ name: day, revenue: 0, orders: 0 }));
    
    const monthRevenue = [
      { name: 'Tuần 1', revenue: 0, orders: 0 },
      { name: 'Tuần 2', revenue: 0, orders: 0 },
      { name: 'Tuần 3', revenue: 0, orders: 0 },
      { name: 'Tuần 4', revenue: 0, orders: 0 }
    ];
    
    const yearRevenue = [
      { name: 'T1', revenue: 0, orders: 0 },
      { name: 'T2', revenue: 0, orders: 0 },
      { name: 'T3', revenue: 0, orders: 0 },
      { name: 'T4', revenue: 0, orders: 0 },
      { name: 'T5', revenue: 0, orders: 0 },
      { name: 'T6', revenue: 0, orders: 0 },
      { name: 'T7', revenue: 0, orders: 0 },
      { name: 'T8', revenue: 0, orders: 0 },
      { name: 'T9', revenue: 0, orders: 0 },
      { name: 'T10', revenue: 0, orders: 0 },
      { name: 'T11', revenue: 0, orders: 0 },
      { name: 'T12', revenue: 0, orders: 0 }
    ];

    let totalRevenue = 0;
    let totalOrders = 0;
    let prevPeriodRevenue = 0;

    orders.forEach((o: any) => {
      const date = new Date(o.createdAt);
      const amount = Number(o.totalAmount || 0);
      
      totalRevenue += amount;
      totalOrders += 1;

      const day = date.getDay();
      weekRevenue[day].revenue += amount;
      weekRevenue[day].orders += 1;

      const weekOfMonth = Math.ceil(date.getDate() / 7) - 1;
      if (weekOfMonth >= 0 && weekOfMonth < 4) {
        monthRevenue[weekOfMonth].revenue += amount;
        monthRevenue[weekOfMonth].orders += 1;
      }

      const month = date.getMonth();
      yearRevenue[month].revenue += amount;
      yearRevenue[month].orders += 1;

      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const twoMonthsAgo = new Date(now);
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      
      if (date >= oneMonthAgo && date < now) {
      } else if (date >= twoMonthsAgo && date < oneMonthAgo) {
        prevPeriodRevenue += amount;
      }
    });

    const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const growth = prevPeriodRevenue > 0 
      ? Math.round(((totalRevenue - prevPeriodRevenue) / prevPeriodRevenue) * 100) 
      : totalRevenue > 0 ? 100 : 0;

    const revenueDataByPeriod = {
      week: weekRevenue,
      month: monthRevenue,
      year: yearRevenue,
      custom: weekRevenue
    };

    const categories = await db.Category.findAll({
      include: [{ model: db.Product, as: 'products', attributes: ['id'] }]
    });
    const categoryData = categories.map((c: any) => ({
      name: c.name,
      value: c.products ? c.products.length : 0
    })).filter((c: any) => c.value > 0);

    const topProductsSales = await db.Product.findAll({
      include: [
        { model: db.OrderItem, as: 'orderItems', attributes: ['quantity', 'price'] },
        { model: db.Category, as: 'categoryData', attributes: ['name'] }
      ]
    });
    
    const topProducts = topProductsSales.map((p: any) => {
      const sales = p.orderItems?.reduce((sum: number, item: any) => sum + Number(item.quantity), 0) || 0;
      const revenue = p.orderItems?.reduce((sum: number, item: any) => sum + (Number(item.quantity) * Number(item.price)), 0) || 0;
      return {
        key: p.id.toString(),
        name: p.name,
        category: p.categoryData?.name || 'Khác',
        sales: sales,
        revenue: revenue,
        status: sales > 10 ? 'Bán chạy' : 'Ổn định'
      };
    }).filter((p: any) => p.sales > 0 && p.revenue > 0)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5);

    const allUsers = await db.User.findAll({ raw: true });
    
    const potentialCustomers = [];
    
    const daysOfWeekUser = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const weekUserData = daysOfWeekUser.map(day => ({ name: day, newUsers: 0, potential: 0 }));
    
    const monthUserData = [
      { name: 'Tuần 1', newUsers: 0, potential: 0 },
      { name: 'Tuần 2', newUsers: 0, potential: 0 },
      { name: 'Tuần 3', newUsers: 0, potential: 0 },
      { name: 'Tuần 4', newUsers: 0, potential: 0 }
    ];
    
    const yearUserData = [
      { name: 'T1', newUsers: 0, potential: 0 },
      { name: 'T2', newUsers: 0, potential: 0 },
      { name: 'T3', newUsers: 0, potential: 0 },
      { name: 'T4', newUsers: 0, potential: 0 },
      { name: 'T5', newUsers: 0, potential: 0 },
      { name: 'T6', newUsers: 0, potential: 0 },
      { name: 'T7', newUsers: 0, potential: 0 },
      { name: 'T8', newUsers: 0, potential: 0 },
      { name: 'T9', newUsers: 0, potential: 0 },
      { name: 'T10', newUsers: 0, potential: 0 },
      { name: 'T11', newUsers: 0, potential: 0 },
      { name: 'T12', newUsers: 0, potential: 0 }
    ];
    
    let totalUsers = 0;
    let potentialCount = 0;
    let staffCount = 0;
    let adminCount = 0;
    let customerCount = 0;
    
    allUsers.forEach((user: any) => {
      const date = new Date(user.createdAt);
      const roleCode = user.role_code || '';
      
      totalUsers++;
      
      if (roleCode === 'R1' || roleCode === 'admin') {
        adminCount++;
      } else if (roleCode === 'R2' || roleCode === 'staff') {
        staffCount++;
      } else {
        customerCount++;
        potentialCount++;
      }
      
      const day = date.getDay();
      weekUserData[day].newUsers++;
      if (roleCode === 'R3' || roleCode === 'customer') {
        weekUserData[day].potential++;
      }
      
      const weekOfMonth = Math.ceil(date.getDate() / 7) - 1;
      if (weekOfMonth >= 0 && weekOfMonth < 4) {
        monthUserData[weekOfMonth].newUsers++;
        if (roleCode === 'R3' || roleCode === 'customer') {
          monthUserData[weekOfMonth].potential++;
        }
      }
      
      const month = date.getMonth();
      yearUserData[month].newUsers++;
      if (roleCode === 'R3' || roleCode === 'customer') {
        yearUserData[month].potential++;
      }
    });
    
    const newUsersData = {
      week: weekUserData,
      month: monthUserData,
      year: yearUserData,
      custom: weekUserData
    };
    
    const roleDistribution = [
      { name: "Quản trị viên", value: adminCount, color: "#f5222d" },
      { name: "Nhân viên", value: staffCount, color: "#faad14" },
      { name: "Khách hàng", value: customerCount, color: "#1890ff" },
    ];
    
    const userStats = {
      totalUsers,
      potentialCount,
      staffCount
    };

    const allProducts = await db.Product.findAll({ raw: true });
    
    const weekImportExport = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => ({ 
      name: day, 
      import: 0, 
      export: 0 
    }));
    
    const monthImportExport = [
      { name: 'Tuần 1', import: 0, export: 0 },
      { name: 'Tuần 2', import: 0, export: 0 },
      { name: 'Tuần 3', import: 0, export: 0 },
      { name: 'Tuần 4', import: 0, export: 0 }
    ];
    
    const yearImportExport = [
      { name: 'T1', import: 0, export: 0 },
      { name: 'T2', import: 0, export: 0 },
      { name: 'T3', import: 0, export: 0 },
      { name: 'T4', import: 0, export: 0 },
      { name: 'T5', import: 0, export: 0 },
      { name: 'T6', import: 0, export: 0 },
      { name: 'T7', import: 0, export: 0 },
      { name: 'T8', import: 0, export: 0 },
      { name: 'T9', import: 0, export: 0 },
      { name: 'T10', import: 0, export: 0 },
      { name: 'T11', import: 0, export: 0 },
      { name: 'T12', import: 0, export: 0 }
    ];

    allProducts.forEach((p: any) => {
      if (p.createdAt) {
        const date = new Date(p.createdAt);
        const day = date.getDay();
        const weekOfMonth = Math.ceil(date.getDate() / 7) - 1;
        const month = date.getMonth();
        const stock = Number(p.stock || 0);
        
        weekImportExport[day].import += stock;
        if (weekOfMonth >= 0 && weekOfMonth < 4) {
          monthImportExport[weekOfMonth].import += stock;
        }
        yearImportExport[month].import += stock;
      }
    });

    orders.forEach((o: any) => {
      const date = new Date(o.createdAt);
      const day = date.getDay();
      const weekOfMonth = Math.ceil(date.getDate() / 7) - 1;
      const month = date.getMonth();
      
      weekImportExport[day].export += 1;
      if (weekOfMonth >= 0 && weekOfMonth < 4) {
        monthImportExport[weekOfMonth].export += 1;
      }
      yearImportExport[month].export += 1;
    });

    const importExportData = {
      week: weekImportExport,
      month: monthImportExport,
      year: yearImportExport,
      custom: weekImportExport
    };

    const allOrders = await db.Order.findAll({ raw: true });
    
    let successCount = 0;
    let failedCount = 0;
    let cancelledCount = 0;
    const regionCounts: Record<string, number> = {};
    
    const daysOfWeekOrder = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const weekOrderData = daysOfWeekOrder.map(day => ({ name: day, success: 0, failed: 0, cancelled: 0 }));
    
    const monthOrderData = [
      { name: 'Tuần 1', success: 0, failed: 0, cancelled: 0 },
      { name: 'Tuần 2', success: 0, failed: 0, cancelled: 0 },
      { name: 'Tuần 3', success: 0, failed: 0, cancelled: 0 },
      { name: 'Tuần 4', success: 0, failed: 0, cancelled: 0 }
    ];
    
    const yearOrderData = [
      { name: 'T1', success: 0, failed: 0, cancelled: 0 },
      { name: 'T2', success: 0, failed: 0, cancelled: 0 },
      { name: 'T3', success: 0, failed: 0, cancelled: 0 },
      { name: 'T4', success: 0, failed: 0, cancelled: 0 },
      { name: 'T5', success: 0, failed: 0, cancelled: 0 },
      { name: 'T6', success: 0, failed: 0, cancelled: 0 },
      { name: 'T7', success: 0, failed: 0, cancelled: 0 },
      { name: 'T8', success: 0, failed: 0, cancelled: 0 },
      { name: 'T9', success: 0, failed: 0, cancelled: 0 },
      { name: 'T10', success: 0, failed: 0, cancelled: 0 },
      { name: 'T11', success: 0, failed: 0, cancelled: 0 },
      { name: 'T12', success: 0, failed: 0, cancelled: 0 }
    ];
    
    allOrders.forEach((order: any) => {
      const date = new Date(order.createdAt);
      
      let statusType: 'success' | 'failed' | 'cancelled' = 'failed';
      if (order.status === 'completed' || order.status === 'shipping' || order.status === 'paid') {
        statusType = 'success';
        successCount++;
      } else if (order.status === 'cancelled') {
        statusType = 'cancelled';
        cancelledCount++;
      } else {
        failedCount++;
      }
      
      const day = date.getDay();
      weekOrderData[day][statusType]++;
      
      const weekOfMonth = Math.ceil(date.getDate() / 7) - 1;
      if (weekOfMonth >= 0 && weekOfMonth < 4) {
        monthOrderData[weekOfMonth][statusType]++;
      }
      
      const month = date.getMonth();
      yearOrderData[month][statusType]++;
      
      const address = order.shippingAddress || '';
      let region = 'Khác';
      if (address.includes('HCM') || address.includes('Hồ Chí Minh') || address.includes('TP. HCM')) {
        region = 'TP. HCM';
      } else if (address.includes('Hà Nội') || address.includes('HN')) {
        region = 'Hà Nội';
      } else if (address.includes('Đà Nẵng')) {
        region = 'Đà Nẵng';
      } else if (address.includes('Cần Thơ')) {
        region = 'Cần Thơ';
      } else if (address.includes('Hải Phòng')) {
        region = 'Hải Phòng';
      }
      
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });
    
    const deliveryRegions = Object.entries(regionCounts)
      .map(([region, deliveries]) => ({ region, deliveries }))
      .sort((a, b) => b.deliveries - a.deliveries)
      .slice(0, 5);
    
    const orderStatsByPeriod = {
      week: weekOrderData,
      month: monthOrderData,
      year: yearOrderData
    };

    return {
      err: 0,
      mess: "Lấy dữ liệu phân tích thành công",
      data: {
        productInteractions,
        priceRangeData,
        peakHoursData,
        trendingFavorites,
        spaServicesStats,
        topStaffs,
        revenueData: weekRevenue,
        revenueDataByPeriod,
        categoryData,
        topProducts,
        potentialCustomers,
        importExportData,
        totals: {
          totalRevenue,
          growth,
          avgOrder
        },
        orderStats: {
          totals: {
            total: allOrders.length,
            success: successCount,
            failed: failedCount,
            cancelled: cancelledCount,
            successRate: allOrders.length > 0 ? Math.round((successCount / allOrders.length) * 100) : 0
          },
          orderStatsByPeriod,
          deliveryRegions
        },
        userStats: {
          ...userStats,
          newUsersData,
          roleDistribution
        }
      }
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi lấy phân tích", data: null };
  }
};
