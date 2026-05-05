import { Request, Response } from "express";
import multer from "multer";
import * as aiService from "../services/ai";
import db from "../models";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export async function predict(req: Request, res: Response) {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ err: 1, mess: "Không có file gửi lên" });
    }

    const result = await aiService.forwardToAiApi(file.buffer, file.originalname, file.mimetype || "application/octet-stream");
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ err: 1, mess: `Lỗi proxy tới AI: ${error.message || error}` });
  }
}

export async function analyze(req: Request, res: Response) {
  let result: any = undefined;
  try {
    const body = req.body || {};
    const response = body.aiResult ?? body;
    // As requested: take result = response.data
    result = response.data;

    // Get advice_id from top-level result.advice_id (same level as scores)
    const adviceId = result.advice_id;
    const finalId = parseInt(adviceId);
    if (isNaN(finalId)) throw new Error('ID vẫn là NaN');

    // Use ProductRecommendation as the primary model for advice
    const AdviceModel = db.ProductRecommendation;
    const ProductModel = db.Product;

    if (!AdviceModel || !ProductModel) {
      console.error('Required models not found', { hasAdvice: !!AdviceModel, hasProduct: !!ProductModel });
      return res.json({ err: 1, mess: 'Các model cần thiết (ProductRecommendation/Product) không tìm thấy trong DB' });
    }

    // Query safely (in parallel) after confirming models exist
    let adviceDetail: any = null;
    let products: any[] = [];
    try {
      [adviceDetail, products] = await Promise.all([
        AdviceModel.findByPk(Number(finalId)),
        ProductModel.findAll({ where: { advice_id: Number(finalId) } }),
      ]);
      // intentionally no debug logs in production
    } catch (e) {
      console.error('Error querying models', e);
      return res.json({ err: 1, mess: 'Database query error', error: String(e), availableModels: Object.keys(db) });
    }

    const scores = result.scores ?? result.data?.scores ?? {};

    // Query Advice_Storage (use requested method, with fallback)
    // Build advice_detail object directly from adviceDetail
    const advice_detail = adviceDetail
      ? {
          id: adviceDetail.id,
          title: adviceDetail.title,
          description: adviceDetail.description,
          morning_routine: adviceDetail.morning_routine ?? adviceDetail.morningRoutine ?? null,
          evening_routine: adviceDetail.evening_routine ?? adviceDetail.eveningRoutine ?? null,
        }
      : null;

    return res.json({ err: 0, data: { scores: scores, overall: result.overall, advice_detail, suggested_products: products } });
  } catch (error: any) {
    console.error('Analyze controller error', error);
    // Return raw AI data for debugging if available
    return res.json({ err: 1, mess: 'Lỗi ID', raw: (typeof result !== 'undefined' ? result : null) });
  }
}

