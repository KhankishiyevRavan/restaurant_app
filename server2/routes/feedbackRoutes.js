const express = require("express");
const router = express.Router();
const makeUploader = require("../middleware/upload");
const {
  createFeedback,
  listFeedback,
  getFeedback,
} = require("../controllers/feedbackController");

const upload = makeUploader("feedback");

router
  .route("/")
  .get(listFeedback)
  .post(upload.array("images", 3), createFeedback);
router.get("/:id", getFeedback);

module.exports = router;
