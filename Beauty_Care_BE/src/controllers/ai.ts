import { Request, Response } from "express";
import multer from "multer";
import * as aiService from "../services/ai";
import db from "../models";
import { cloudinary } from "../config/cloudinary";
import fs from "fs";
import path from "path";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export async function predict(req: Request, res: Response) {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ err: 1, mess: "Không có file gửi lên" });
    }

    // Forward to AI API
    const aiResult = await aiService.forwardToAiApi(file.buffer, file.originalname, file.mimetype || "application/octet-stream");

    // Upload to Cloudinary for history, or fallback to local
    let skinImage = "";
    if (process.env.CLOUDINARY_NAME) {
      try {
        const uploadRes = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "skin-analysis", format: "jpg" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(file.buffer);
        }) as any;
        skinImage = uploadRes.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed", err);
      }
    } else {
      // Local fallback
      try {
        const uploadDir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileName = `skin-${Date.now()}.jpg`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        
        // Construct local URL
        const protocol = req.protocol;
        const host = req.get("host");
        skinImage = `${protocol}://${host}/uploads/${fileName}`;
      } catch (err) {
        console.error("Local save failed", err);
      }
    }

    return res.json({ ...aiResult, skinImage });
  } catch (error: any) {
    return res.status(500).json({ err: 1, mess: `Lỗi proxy tới AI: ${error.message || error}` });
  }
}

export async function analyze(req: Request, res: Response) {
  try {
    const body = req.body || {};
    const aiResult = body.aiResult ?? body;
    const userId = (req as any).user?.id;
    const skinImage = body.skinImage;

    const result = await aiService.processAiResult(aiResult, userId, skinImage);
    return res.json(result);
  } catch (error: any) {
    console.error("Analyze controller error", error);
    return res.json({ err: 1, mess: error.message || "Lỗi xử lý kết quả AI" });
  }
}

export async function getHistory(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ err: 1, mess: "Bạn chưa đăng nhập" });
    }

    const history = await db.SkinAnalysisHistory.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.ProductRecommendation,
          as: "advice",
        },
      ],
      order: [["analysis_date", "DESC"]],
    });

    const formattedHistory = await Promise.all(history.map(async (h: any) => {
      // Fetch suggested products for this advice_id
      let products = [];
      if (h.advice_id) {
        try {
          products = await db.Product.findAll({ 
            where: { advice_id: h.advice_id },
            limit: 4 // Match typical display limit
          });
        } catch (e) {
          console.error("Fetch products for history failed", e);
        }
      }

      return {
        id: h.id,
        analysis_date: h.analysis_date,
        skin_image: h.skin_image,
        detected_skin_type: h.advice?.title || h.detected_skin_type,
        scores: {
          acne: h.acne_score,
          blackheads: h.blackheads_score,
          dark_spots: h.dark_spots_score,
          pores: h.pores_score,
          wrinkles: h.wrinkles_score,
        },
        overall: h.overall_score || h.overall,
        advice_detail: h.advice ? {
          id: h.advice.id,
          title: h.advice.title,
          description: h.advice.description,
          morning_routine: h.advice.morning_routine || h.advice.morningRoutine,
          evening_routine: h.advice.evening_routine || h.advice.eveningRoutine,
        } : null,
        suggested_products: products,
        advice_id: h.advice_id,
      };
    }));

    return res.json({ err: 0, data: formattedHistory });
  } catch (error: any) {
    console.error("Get history error", error);
    return res.status(500).json({ err: 1, mess: error.message || "Lỗi lấy lịch sử" });
  }
}

