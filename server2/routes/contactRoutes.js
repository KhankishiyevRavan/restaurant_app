const { Router } = require("express");
const {
  createContact,
  listContacts,
  getContact,
} = require("../controllers/contactController");

const router = Router();

// Public endpoint (frontend form buraya POST edir)
router.post("/", createContact);

// Sadə oxu (sonradan auth ilə qoruyarsan)
router.get("/", listContacts);
router.get("/:id", getContact);

module.exports = router;
