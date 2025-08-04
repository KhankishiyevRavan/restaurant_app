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

// ID ilə yemək
const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item tapılmadı" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni yemək əlavə et
const createMenuItem = async (req, res) => {
  try {
    let { name, price, time, rating, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    // name JSON string gələ bilər → parse et
    if (typeof name === "string") {
      name = JSON.parse(name);
    }

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

// Yeməyi edit et
const updateMenuItem = async (req, res) => {
  try {
    let { name, price, time, rating, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (typeof name === "string") {
      name = JSON.parse(name);
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        time,
        rating,
        category,
        ...(image && { image }),
      },
      { new: true }
    );

    if (!updatedItem)
      return res.status(404).json({ message: "Item tapılmadı" });

    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) return res.status(404).json({ message: "Item tapılmadı" });

    res.json({ message: "Item uğurla silindi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};
