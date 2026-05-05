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

export async function processAiResult(aiResult: any, userId?: number | null) {
  // try to extract advice id and skin scores from common keys
  const adviceId = aiResult?.advice_id ?? aiResult?.adviceId ?? aiResult?.advice ?? aiResult?.advice_group;
  const skinScores = aiResult?.skin_scores ?? aiResult?.scores ?? aiResult?.metrics ?? aiResult?.result ?? aiResult;

  if (!adviceId) {
    throw new Error("Không tìm thấy advice_id trong kết quả AI");
  }

  // Fetch advice details
  const finalAdviceId = Number(adviceId);
  const advice = await db.ProductRecommendation?.findByPk(finalAdviceId);

  // Fetch products that match advice_group. Use raw query to be tolerant to model differences.
  let products: any[] = [];
  try {
    const replacements = { adviceId: finalAdviceId };
    const sql = 'SELECT * FROM "Products" WHERE advice_id = :adviceId AND (status IS NULL OR status = \'' + "active" + "')";
    // Some DBs might not have advice_group column; try safely
      const q = `SELECT * FROM "Products" WHERE advice_id = :adviceId AND (status = 'active')`;
      products = await db.sequelize.query(q, { replacements, type: db.Sequelize.QueryTypes.SELECT });
    } catch (err) {
      // fallback: try using Product model findAll with where literal
      try {
        products = await db.Product.findAll({ where: db.Sequelize.literal(`advice_id = ${Number(adviceId)}`) });
    } catch (e) {
      products = [];
    }
  }

  // Build history payload
  const payload = {
    userId: userId ?? null,
    adviceId: finalAdviceId,
    skinScores,
    adviceTitle: advice?.title ?? null,
    adviceDescription: advice?.description ?? null,
    morningRoutine: advice?.morning_routine ?? null,
    eveningRoutine: advice?.evening_routine ?? null,
    products,
  };

  // Save history
  let history: any = null;
  try {
    history = await db.SkinHistory.create(payload as any);
  } catch (err) {
    // If create fails, still return combined data
    history = null;
  }

  // Return combined JSON suitable for frontend
  return {
    err: 0,
    data: {
      history: history ? { id: history.id, createdAt: history.createdAt } : null,
      advice: {
        id: finalAdviceId,
        title: advice?.title ?? null,
        description: advice?.description ?? null,
        morning_routine: advice?.morning_routine ?? null,
        evening_routine: advice?.evening_routine ?? null,
      },
      products,
      skinScores,
    },
  };
}
