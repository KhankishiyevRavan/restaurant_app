const mongoose = require("mongoose");

const serviceFeedbackSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5, required: true },
    waiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Waiter",
      required: true,
    },
    message: { type: String, default: "", trim: true, maxlength: 2000 },
    images: [{ type: String }], // /uploads/feedback/filename.jpg
  },
  { timestamps: true }
);

serviceFeedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ServiceFeedback", serviceFeedbackSchema);
