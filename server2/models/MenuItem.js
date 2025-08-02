const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    time: { type: String },
    rating: { type: Number, default: 0 },
    image: { type: String }, // şəkil linki
    category: { type: String, default: "All" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
