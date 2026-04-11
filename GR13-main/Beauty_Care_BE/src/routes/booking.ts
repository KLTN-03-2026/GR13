import express from "express";
import * as controllers from "../controllers";
import { verifyToken } from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";

const router = express.Router();

// Public routes (để khách xem nhân viên)
router.get("/staffs", controllers.getStaffs);

// Private routes
router.use(verifyToken);
router.get("/admin", isAdmin, controllers.adminGetBookings);
router.get("/admin/:bookingId", isAdmin, controllers.adminGetBookingDetail);
router.put("/admin/:bookingId", isAdmin, controllers.adminUpdateBooking);
router.get("/my-bookings", controllers.getMyBookings);
router.post("/create", controllers.createBooking);
router.post("/cancel", controllers.cancelBooking);

export default router;
