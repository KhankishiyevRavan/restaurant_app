const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// .env faylını məhz server2 qovluğundan oxu
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // şəkil göstərmək

// DB Connect
connectDB();
const createAdminRole = async () => {
  try {
    const existingRole = await Role.findOne({ name: "admin" });
    if (!existingRole) {
      const adminRole = new Role({
        name: "admin",
        permissions: ["create", "edit", "delete"], // Admin icazələri (istəyə uyğun əlavə edə bilərsiniz)
      });
      await adminRole.save();
      console.log("✅ Admin role created");
    } else {
      console.log("ℹ️ Admin role already exists");
    }
  } catch (err) {
    console.error("Error creating admin role:", err);
  }
};

// createAdminRole();

const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({
      fname: "admin",
      lname: "admin",
    });

    // Əgər admin istifadəçisi artıq varsa, məlumat veririk
    if (!existingAdmin) {
      // Admin rolunu tapırıq
      const adminRole = await Role.findOne({ name: "admin" });

      // Admin rolunu tapmaq olmazsa, xəbərdarlıq veririk
      if (!adminRole) {
        console.log("Error: Admin role not found");
        return;
      }

      // Yeni admin istifadəçisi yaradılır
      const admin = new User({
        fname: "admin",
        lname: "admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASS,
        role: adminRole._id, // Admin rolunun ObjectId-si istifadəçiyə təyin edilir
      });

      await admin.save();
      console.log("✅ Admin user created");
    } else {
      console.log("ℹ️ Admin user already exists");
    }
  } catch (err) {
    console.error("Error creating admin user:", err);
  }
};

// createAdminUser();
// Routes
const menuRoutes = require("./routes/menuRoutes");
app.use("/api/menu", menuRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
