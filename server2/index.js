const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const { notFound, errorHandler } = require("./middleware/error");
const authRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const waiterRoutes = require("./routes/waiterRoutes");
const menuRoutes = require("./routes/menuRoutes");
const roleRoutes = require("./routes/roleRoutes");

// .env faylını _bu_ qovluqdan oxu
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

/* ---------------- Core Middlewares ---------------- */
const raw = process.env.CLIENT_URL || "";
const allowlist = raw
  .split(",")
  .map((s) => s.trim().replace(/\/$/, "")) // ehtiyat üçün sondakı /-u sil
  .filter(Boolean);

app.use((req, _res, next) => {
  // Diaqnostika üçün müvəqqəti log (sonra silərsən)
  if (req.headers.origin) {
    console.log("Origin:", req.headers.origin, "Allowlist:", allowlist);
  }
  next();
});

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Postman, curl
      const o = origin.replace(/\/$/, "");
      if (allowlist.includes(o)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${o}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Preflight üçün də (opsional, amma faydalıdır)
app.options(
  "*",
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const o = origin.replace(/\/$/, "");
      if (allowlist.includes(o)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${o}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Şəkillərə birbaşa çıxış
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------------- Health ---------------- */
app.get("/health", (_req, res) => res.json({ ok: true }));

/* ---------------- Routes ---------------- */
app.use("/api/roles", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/waiters", waiterRoutes);
app.use("/api/service-feedback", feedbackRoutes);
app.use("/api/menu", menuRoutes);

/* ---------------- Errors ---------------- */
// 404 və ümumi errorlar routelardan sonra gəlir
app.use(notFound);
app.use(errorHandler);

/* ---------------- Start Server after DB ---------------- */
const PORT = process.env.PORT || 5002;

(async () => {
  try {
    await connectDB(); // ⚠️ Gözləyirik
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Mongo connect error:", err.message);
    process.exit(1);
  }
})();
