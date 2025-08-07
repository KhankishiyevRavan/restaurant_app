const MenuItem = require("../models/MenuItem");

// 🔹 Description-u parçala
function parseDescription(req) {
  let description = req.body.description || {
    az: req.body["description[az]"],
    tr: req.body["description[tr]"],
    en: req.body["description[en]"],
    ru: req.body["description[ru]"],
    fr: req.body["description[fr]"],
  };

  if (typeof description === "string") {
    try {
      description = JSON.parse(description);
    } catch {
      return null;
    }
  }

  return description;
}

function parseName(req) {
  let name = req.body.name || {
    az: req.body["name[az]"],
    tr: req.body["name[tr]"],
    en: req.body["name[en]"],
    ru: req.body["name[ru]"],
    fr: req.body["name[fr]"],
  };

  if (typeof name === "string") {
    try {
      name = JSON.parse(name);
    } catch {
      return null;
    }
  }

  return name;
}

// 🔹 Bütün yeməkləri gətir
const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 ID ilə yemək
const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Yeməyi sil
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Yeni yemək əlavə et
const createMenuItem = async (req, res) => {
  try {
    const { price, time, rating, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const name = parseName(req);
    const description = parseDescription(req);

    if (
      !name?.az ||
      !name?.tr ||
      !name?.en ||
      !name?.ru ||
      !name?.fr ||
      !description?.az ||
      !description?.tr ||
      !description?.en ||
      !description?.ru ||
      !description?.fr
    ) {
      return res
        .status(400)
        .json({ message: "Name and Description in all languages required" });
    }

    const newItem = new MenuItem({
      name,
      description,
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

// 🔹 Yeməyi yenilə
const updateMenuItem = async (req, res) => {
  try {
    const { price, time, rating, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const name = parseName(req);
    const description = parseDescription(req);

    if (
      !name?.az ||
      !name?.tr ||
      !name?.en ||
      !name?.ru ||
      !name?.fr ||
      !description?.az ||
      !description?.tr ||
      !description?.en ||
      !description?.ru ||
      !description?.fr
    ) {
      return res
        .status(400)
        .json({ message: "Name and Description in all languages required" });
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        time,
        rating,
        category,
        ...(image && { image }),
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
