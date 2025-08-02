const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getMenuItems,
  createMenuItem,
} = require("../controllers/menuController");

const router = express.Router();

// Multer config
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");

// Əgər uploads qovluğu yoxdursa, yarat
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// GET bütün yeməklər
router.get("/", getMenuItems);

// POST yeni yemək (şəkil ilə birlikdə)
router.post("/", upload.single("image"), createMenuItem);

module.exports = router;
