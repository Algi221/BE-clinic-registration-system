const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Get all schedules
router.get("/", async (req, res) => {
  const jadwals = await prisma.jadwalDokter.findMany({
    include: {
      dokter: {
        include: { poli: true },
      },
    },
  });
  res.json(jadwals);
});

// Create schedule (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { dokterId, hari, jamMulai, jamSelesai } = req.body;
    const jadwal = await prisma.jadwalDokter.create({
      data: { dokterId, hari, jamMulai, jamSelesai },
    });
    res.status(201).json(jadwal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
