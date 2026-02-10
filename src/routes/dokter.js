const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Get all doctors with their poli
router.get("/", async (req, res) => {
  const dokters = await prisma.dokter.findMany({
    include: { poli: true },
  });
  res.json(dokters);
});

// Create doctor (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { nama, spesialis, poliId } = req.body;
    const dokter = await prisma.dokter.create({
      data: { nama, spesialis, poliId },
    });
    res.status(201).json(dokter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
