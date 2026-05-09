import { Buffer } from "buffer";
import db from "../models";

export async function forwardToAiApi(fileBuffer: Buffer, filename: string, mimeType: string) {
  const boundary = "----BeautyCareBoundary" + Date.now();
  const crlf = "\r\n";

  let partHeader = `--${boundary}${crlf}`;
  partHeader += `Content-Disposition: form-data; name="file"; filename="${filename}"${crlf}`;
  partHeader += `Content-Type: ${mimeType}${crlf}${crlf}`;

  const headerBuf = Buffer.from(partHeader, "utf8");
  const footerBuf = Buffer.from(`${crlf}--${boundary}--${crlf}`, "utf8");

  const body = Buffer.concat([headerBuf, fileBuffer, footerBuf]);

  const res = await fetch("https://ai.gmaii.pro.vn/api/ai/upload", {
    method: "POST",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "Content-Length": String(body.length),
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI API error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function processAiResult(aiResult: any, userId?: number | null, skinImage?: string | null) {
  // try to extract advice id and skin scores from common keys, checking nested 'data' if present
  const inner = aiResult?.data ?? aiResult;

  const adviceId = inner?.advice_id ?? inner?.adviceId ?? inner?.advice ?? inner?.advice_group ?? aiResult?.advice_id;
  const skinScores = inner?.skin_scores ?? inner?.scores ?? inner?.metrics ?? inner?.result ?? inner;
  const overallScore = inner?.overallScore ?? inner?.overall ?? skinScores?.overall ?? aiResult?.overall ?? 0;

  if (!adviceId) {
    throw new Error("Không tìm thấy advice_id trong kết quả AI");
  }

  // Fetch advice details
  const finalAdviceId = Number(adviceId);
  const advice = await db.ProductRecommendation?.findByPk(finalAdviceId);

  // Fetch products that match advice_id.
  let products: any[] = [];
  try {
    const replacements = { adviceId: finalAdviceId };
    const q = `SELECT * FROM "Products" WHERE advice_id = :adviceId AND (status = 'active' OR status IS NULL)`;
    products = await db.sequelize.query(q, { replacements, type: db.Sequelize.QueryTypes.SELECT });
  } catch (err) {
    try {
      products = await db.Product.findAll({ where: { advice_id: finalAdviceId } });
    } catch (e) {
      products = [];
    }
  }

  // Save history if userId is provided
  let history: any = null;
  if (userId) {
    const historyPayload = {
      user_id: userId,
      skin_image: skinImage || "",
      detected_skin_type: advice?.title || "Unknown",
      acne_score: skinScores?.acne || 0,
      blackheads_score: skinScores?.blackheads || 0,
      dark_spots_score: skinScores?.dark_spots || 0,
      pores_score: skinScores?.pores || 0,
      wrinkles_score: skinScores?.wrinkles || 0,
      overall_score: overallScore,
      advice_id: finalAdviceId,
      analysis_date: new Date(),
    };

    try {
      history = await db.SkinAnalysisHistory.create(historyPayload);
    } catch (err) {
      console.error("Save history failed:", err);
      history = null;
    }
  }

  // Return combined JSON suitable for frontend
  return {
    err: 0,
    data: {
      history: history ? { id: history.id, createdAt: history.createdAt } : null,
      advice_detail: advice
        ? {
            id: advice.id,
            title: advice.title,
            description: advice.description,
            morning_routine: advice.morning_routine,
            evening_routine: advice.evening_routine,
          }
        : null,
      suggested_products: products,
      scores: skinScores,
      overall: overallScore,
    },
  };
}
