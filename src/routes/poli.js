const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Get all poli
router.get("/", async (req, res) => {
  const polis = await prisma.poli.findMany();
  res.json(polis);
});

// Create poli (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { nama, deskripsi } = req.body;
    const poli = await prisma.poli.create({
      data: { nama, deskripsi },
    });
    res.status(201).json(poli);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
