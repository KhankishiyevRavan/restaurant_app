const MenuItem = require("../models/MenuItem");

// Bütün yeməkləri gətir
const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni yemək əlavə et
const createMenuItem = async (req, res) => {
  try {
    const { name, price, time, rating, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const newItem = new MenuItem({
      name,
      price,
      time,
      rating,
      category,
      image,
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getMenuItems, createMenuItem };
