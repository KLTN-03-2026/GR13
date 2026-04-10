import * as services from "../services";
import { InternalServerError, badRequest } from "../middlewares/handle_error";
import { Request, Response } from "express";
import Joi from "joi";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const schema = Joi.object({
      productId: Joi.number().required(),
      staffId: Joi.number().optional(),
      bookingDate: Joi.string().required(),
      startTime: Joi.string().required(),
      notes: Joi.string().allow("", null).optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return badRequest(error.details[0].message, res);

    const response = await services.createBooking({ userId, ...value });
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const response = await services.getMyBookings(userId);
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const getStaffs = async (req: Request, res: Response) => {
  try {
    const response = await services.getStaffs();
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id: userId } = (req as any).user;
    const { bookingId } = req.body;
    if (!bookingId) return badRequest("Thiếu Booking ID", res);

    const response = await services.cancelBooking(userId, Number(bookingId));
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const adminGetBookings = async (req: Request, res: Response) => {
  try {
    const response = await services.adminGetBookings();
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const adminGetBookingDetail = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    if (!bookingId) return badRequest("Thiếu Booking ID", res);

    const response = await services.adminGetBookingDetail(Number(bookingId));
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};

export const adminUpdateBooking = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      status: Joi.string().valid("pending", "confirmed", "completed", "cancelled").optional(),
      staffId: Joi.number().allow(null).optional(),
      endTime: Joi.string().allow("", null).optional(),
    });

    const { bookingId } = req.params;
    if (!bookingId) return badRequest("Thiếu Booking ID", res);

    const { error, value } = schema.validate(req.body);
    if (error) return badRequest(error.details[0].message, res);

    const response = await services.adminUpdateBooking({
      bookingId: Number(bookingId),
      status: value.status,
      staffId: value.staffId,
      endTime: value.endTime === "" ? null : value.endTime,
    });
    return res.status(200).json(response);
  } catch (error) {
    return InternalServerError(res);
  }
};
