const ServiceFeedback = require("../models/ServiceFeedback");
const Waiter = require("../models/Waiter");
const asyncHandler = require("../middleware/asyncHandler");

// POST /api/service-feedback
exports.createFeedback = asyncHandler(async (req, res) => {
  const { rating, waiterId, message } = req.body;
  const files = req.files || [];

  const r = Number(rating);
  if (!r || r < 1 || r > 5) {
    res.status(400);
    throw new Error("Reytinq 1-5 aralığında olmalıdır.");
  }
  if (!waiterId) {
    res.status(400);
    throw new Error("Ofisiant seçilməlidir.");
  }
  const waiter = await Waiter.findById(waiterId);
  if (!waiter) {
    res.status(404);
    throw new Error("Seçilmiş ofisiant tapılmadı.");
  }
  if (files.length < 1) {
    res.status(400);
    throw new Error("Minimum 1 şəkil yükləməlisiniz.");
  }
  if (files.length > 3) {
    res.status(400);
    throw new Error("Maksimum 3 şəkil yükləyə bilərsiniz.");
  }

  const images = files.map((f) => `/uploads/feedback/${f.filename}`);

  const doc = await ServiceFeedback.create({
    rating: r,
    waiter: waiter._id,
    message: message || "",
    images,
  });

  res
    .status(201)
    .json({ ok: true, data: await doc.populate("waiter", "name") });
});

// GET /api/service-feedback
exports.listFeedback = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    ServiceFeedback.find()
      .populate("waiter", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ServiceFeedback.countDocuments(),
  ]);

  res.json({ ok: true, page, limit, total, items });
});

// GET /api/service-feedback/:id
exports.getFeedback = asyncHandler(async (req, res) => {
  const fb = await ServiceFeedback.findById(req.params.id).populate(
    "waiter",
    "name"
  );
  if (!fb) {
    res.status(404);
    throw new Error("Feedback tapılmadı.");
  }
  res.json({ ok: true, data: fb });
});
