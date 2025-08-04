const MenuItem = require("../models/MenuItem");

// Bütün yeməkləri gətir
const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();
    console.log(items);

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ID ilə yemək
const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni yemək əlavə et
const createMenuItem = async (req, res) => {
  try {
    console.log(req.body);

    const { price, time, rating, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    // `name[az]`, `name[en]`, `name[ru]` olaraq gələcək
    const name = {
      az: req.body["name[az]"],
      en: req.body["name[en]"],
      ru: req.body["name[ru]"],
    };

    if (!name.az || !name.en || !name.ru) {
      return res
        .status(400)
        .json({ message: "Name in all languages required" });
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

// Yeməyi yenilə
const updateMenuItem = async (req, res) => {
  try {
    const { price, time, rating, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const name = {
      az: req.body["name[az]"],
      en: req.body["name[en]"],
      ru: req.body["name[ru]"],
    };

    if (!name.az || !name.en || !name.ru) {
      return res
        .status(400)
        .json({ message: "Name in all languages required" });
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
      return res.status(404).json({ message: "Item not found" });

    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Yeməyi sil
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
