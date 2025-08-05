const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      az: { type: String, required: true },
      tr: { type: String, required: true },
      en: { type: String, required: true },
      ru: { type: String, required: true },
      fr: { type: String, required: true },
    },
    price: { type: String, required: true, default: 0 },
    time: { type: String },
    rating: { type: Number, default: 0 },
    image: { type: String }, // şəkil linki
    category: { type: String, default: "All" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
