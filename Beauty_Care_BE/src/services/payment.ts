import payOS from "../config/payos";
import db from "../models";

export const createPaymentLink = async (orderId: number) => {
  try {
    const order = await db.Order.findByPk(orderId, {
      include: [
        {
          model: db.OrderItem,
          as: "orderItems",
          include: [{ model: db.Product, as: "productData" }],
        },
      ],
    });

    if (!order) {
      return { err: 1, mess: "Không tìm thấy đơn hàng" };
    }

    const domain = process.env.CLIENT_URL || "http://localhost:5173";
    // Đảm bảo orderCode là duy nhất và là số nguyên dương
    const orderCode = Number(String(Date.now()).slice(-9));

    const amount = Math.round(Number(order.totalAmount));
    if (amount < 2000) {
      return { err: 1, mess: "Số tiền thanh toán phải từ 2,000 VND trở lên" };
    }

    const body: any = {
      orderCode,
      amount,
      description: `Thanh toan #${order.id}`
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s#]/gi, ""),
      items: order.orderItems.map((item: any) => ({
        name: item.productData.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .substring(0, 25),
        quantity: item.quantity,
        price: Math.round(Number(item.price)),
      })),
      returnUrl: `${domain}/order-success?orderId=${order.id}&status=PAID`,
      cancelUrl: `${domain}/order-success?orderId=${order.id}&status=CANCELLED`,
    };

    console.log("PayOS Request Body:", JSON.stringify(body, null, 2));

    const paymentLinkRes = await payOS.paymentRequests.create(body);

    await order.update({
      paymentLinkId: paymentLinkRes.paymentLinkId,
      checkoutUrl: paymentLinkRes.checkoutUrl,
      orderCode,
    });

    return {
      err: 0,
      mess: "Tạo link thanh toán thành công",
      data: {
        checkoutUrl: paymentLinkRes.checkoutUrl,
      },
    };
  } catch (error: any) {
    console.error("PayOS Error Details:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });
    return {
      err: 1,
      mess: error.message || "Có lỗi xảy ra khi tạo link thanh toán",
    };
  }
};

export const handleWebhook = async (webhookData: any) => {
  try {
    const verifiedData = await payOS.webhooks.verify(webhookData);
    const { orderCode, code } = verifiedData;

    if (code === "00") {
      const order = await db.Order.findOne({ where: { orderCode } });
      if (order) {
        await order.update({ status: "paid" });
        console.log(`Order ${order.id} updated to paid via Webhook`);
      }
    }

    return { err: 0, mess: "Webhook handled" };
  } catch (error) {
    console.error("Webhook Error:", error);
    return { err: 1, mess: "Webhook error" };
  }
};

export const verifyPayment = async (orderId: number) => {
  try {
    const order = await db.Order.findByPk(orderId);
    if (!order) {
      return { err: 1, mess: "Không tìm thấy đơn hàng" };
    }

    const isPaidInDB = ["paid", "shipping", "completed"].includes(order.status);
    if (isPaidInDB) {
      return {
        err: 0,
        mess: "Đơn hàng đã được thanh toán",
        data: { status: "PAID" },
      };
    }

    if (!order.orderCode) {
      return { err: 1, mess: "Đơn hàng chưa có mã thanh toán" };
    }

    const paymentLinkInfo = await payOS.paymentRequests.get(order.orderCode);
    console.log("PayOS Payment Info:", paymentLinkInfo);

    if (paymentLinkInfo.status === "PAID") {
      await order.update({ status: "completed" });
      return {
        err: 0,
        mess: "Thanh toán thành công",
        data: { status: "PAID" },
      };
    }

    return {
      err: 0,
      mess: "Đơn hàng chưa được thanh toán",
      data: { status: paymentLinkInfo.status },
    };
  } catch (error: any) {
    console.error("Verify Payment Error:", error);
    return { err: 1, mess: error.message || "Lỗi khi kiểm tra thanh toán" };
  }
};
