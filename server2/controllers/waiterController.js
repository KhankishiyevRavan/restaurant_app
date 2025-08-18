const Waiter = require("../models/Waiter");
const asyncHandler = require("../middleware/asyncHandler");
const mongoose = require("mongoose");

// POST /api/waiters
exports.createWaiter = asyncHandler(async (req, res) => {
  const { name, isActive } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Ad tələb olunur");
  }
  const w = await Waiter.create({ name, isActive: isActive ?? true });
  res.status(201).json({ ok: true, data: w });
});

// GET /api/waiters
exports.listWaiters = asyncHandler(async (req, res) => {
  const items = await Waiter.find().sort({ name: 1 });
  res.json({ ok: true, items });
});


// Helper: standart cavab
const ok = (res, data = null, extra = {}) =>
  res.json({ ok: true, data, ...extra });
const fail = (res, status = 400, message = "Xəta baş verdi") =>
  res.status(status).json({ ok: false, message });

/**
 * PATCH /api/waiters/:id
 * Body: { name?: string, isActive?: boolean }
 */
exports.updateWaiter = async (req, res) => {
  try {
    const { id } = req.params;

    // ObjectId yoxlaması
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return fail(res, 400, "Yanlış Waiter ID.");
    }

    const payload = {};
    if (typeof req.body.name === "string") {
      const name = req.body.name.trim();
      if (!name) return fail(res, 400, "Ad boş ola bilməz.");
      payload.name = name;
    }
    if (typeof req.body.isActive === "boolean") {
      payload.isActive = req.body.isActive;
    }

    if (Object.keys(payload).length === 0) {
      return fail(res, 400, "Dəyişəcək sahə göndərilməyib.");
    }

    const updated = await Waiter.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) return fail(res, 404, "Ofisiant tapılmadı.");
    return ok(res, updated);
  } catch (err) {
    console.error("updateWaiter error:", err);
    return fail(res, 500, "Server xətası (update).");
  }
};

/**
 * DELETE /api/waiters/:id
 */
exports.deleteWaiter = async (req, res) => {
  try {
    const { id } = req.params;

    // ObjectId yoxlaması
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return fail(res, 400, "Yanlış Waiter ID.");
    }

    const deleted = await Waiter.findByIdAndDelete(id);
    if (!deleted) return fail(res, 404, "Ofisiant tapılmadı.");

    // İstəsən data qaytarma, sadəcə ok ver
    return res.json({ ok: true });
  } catch (err) {
    console.error("deleteWaiter error:", err);
    return fail(res, 500, "Server xətası (delete).");
  }
};
