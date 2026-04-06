import express from "express";
import * as controllers from "../controllers";
import { verifyToken } from "../middlewares/verify_token";

const router = express.Router();

// Public routes (để khách xem nhân viên)
router.get("/staffs", controllers.getStaffs);

// Private routes
router.use(verifyToken);
router.get("/my-bookings", controllers.getMyBookings);
router.post("/create", controllers.createBooking);
router.post("/cancel", controllers.cancelBooking);

export default router;
