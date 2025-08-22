import { db } from "../db.js";

export async function logMiddleware(req, res, next) {
  const start = Date.now();

  // Override res.json to capture status code
  const oldJson = res.json.bind(res);
  res.json = (body) => {
    res.locals._statusCode = res.statusCode;
    return oldJson(body);
  };

  // After response finished
  res.on("finish", async () => {
    const duration = Date.now() - start;
    const userId = (req.user && req.user.id) || null;

    try {
      await db.collection("api_logs").insertOne({
        user_id: userId,
        method: req.method,
        endpoint: req.originalUrl,
        payload_json: req.body || {},
        status_code: res.statusCode,
        duration_ms: duration,
        ip: req.ip || null,
        created_at: new Date()
      });
    } catch (e) {
      // silently ignore logging errors
      console.error("Failed to log API call:", e.message);
    }
  });

  next();
}
