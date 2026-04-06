import db from "../models";

export const createBooking = async (payload: {
  userId: number;
  productId: number;
  staffId?: number;
  bookingDate: string;
  startTime: string;
  notes?: string;
}) => {
  try {
    const { userId, productId, staffId, bookingDate, startTime, notes } = payload;

    // 1. Kiểm tra dịch vụ có tồn tại không
    const service = await db.Product.findByPk(productId);
    if (!service) return { err: 1, mess: "Dịch vụ không tồn tại" };

    // 2. Kiểm tra nhân viên có tồn tại không (nếu có chọn)
    if (staffId) {
      const staff = await db.Staff.findByPk(staffId);
      if (!staff) return { err: 1, mess: "Nhân viên không tồn tại" };
    }

    // 3. Tạo lịch hẹn
    const booking = await db.Booking.create({
      userId,
      productId,
      staffId,
      bookingDate,
      startTime,
      notes,
      status: "pending",
    });

    return {
      err: 0,
      mess: "Đặt lịch thành công, vui lòng chờ xác nhận",
      data: booking,
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi đặt lịch" };
  }
};

export const getMyBookings = async (userId: number) => {
  try {
    const bookings = await db.Booking.findAll({
      where: { userId },
      include: [
        { model: db.Product, as: "serviceData", attributes: ["name", "image", "price"] },
        { model: db.Staff, as: "staffData", attributes: ["name", "specialty"] },
      ],
      order: [["bookingDate", "DESC"], ["startTime", "DESC"]],
    });

    return {
      err: 0,
      mess: "Lấy danh sách lịch hẹn thành công",
      data: bookings,
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi lấy lịch hẹn" };
  }
};

export const getStaffs = async () => {
  try {
    const staffs = await db.Staff.findAll({ where: { status: "active" } });
    return {
      err: 0,
      mess: "Lấy danh sách nhân viên thành công",
      data: staffs,
    };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi lấy danh sách nhân viên" };
  }
};

export const cancelBooking = async (userId: number, bookingId: number) => {
  try {
    const booking = await db.Booking.findOne({
      where: { id: bookingId, userId },
    });

    if (!booking) return { err: 1, mess: "Không tìm thấy lịch hẹn" };

    if (booking.status !== "pending" && booking.status !== "confirmed") {
      return { err: 1, mess: "Không thể hủy lịch hẹn đã hoàn thành hoặc đã hủy" };
    }

    await booking.update({ status: "cancelled" });

    return { err: 0, mess: "Hủy lịch hẹn thành công" };
  } catch (error) {
    console.error(error);
    return { err: 1, mess: "Có lỗi xảy ra khi hủy lịch hẹn" };
  }
};
