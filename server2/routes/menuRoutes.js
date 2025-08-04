const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const router = express.Router();

// Uploads qovluğu
const uploadDir = path.join(__dirname, "../uploads");

// Əgər uploads qovluğu yoxdursa, yarat
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Bütün yeməklər
router.get("/", getMenuItems);

// ✅ ID ilə yemək
router.get("/:id", getMenuItemById);

// ✅ Yeni yemək əlavə et (şəkil ilə birlikdə)
router.post("/", upload.single("image"), createMenuItem);

// ✅ Yeməyi edit et (şəkil optional)
router.put("/:id", upload.single("image"), updateMenuItem);

router.delete("/:id", deleteMenuItem); // 🔥 delete route

module.exports = router;
