const express = require("express");
const router = express.Router();
const {
  createWaiter,
  listWaiters,
  updateWaiter,
  deleteWaiter,
} = require("../controllers/waiterController");

router.route("/").get(listWaiters).post(createWaiter);

// PATCH /api/waiters/:id  (update)
router.patch("/:id", updateWaiter);

// DELETE /api/waiters/:id (delete)
router.delete("/:id", deleteWaiter);


module.exports = router;
