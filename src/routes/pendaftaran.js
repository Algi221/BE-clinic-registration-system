const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const {
  emitNewRegistration,
  emitRegistrationStatusUpdate,
} = require("../utils/socketEmitter");

// Get all registrations (Filtered by role)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let where = {};
    if (req.user.role === "PATIENT") {
      where = { pasienId: req.user.id };
    }

    const pendaftaran = await prisma.pendaftaran.findMany({
      where,
      include: {
        pasien: { select: { name: true, email: true } },
        jadwal: {
          include: {
            dokter: { include: { poli: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(pendaftaran);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create registration
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { jadwalId, keluhan } = req.body;
    const pendaftaran = await prisma.pendaftaran.create({
      data: {
        pasienId: req.user.id,
        jadwalId,
        keluhan,
        status: "PENDING",
      },
      include: {
        pasien: { select: { name: true, email: true } },
        jadwal: {
          include: {
            dokter: { include: { poli: true } },
          },
        },
      },
    });

    // Emit WebSocket event untuk notifikasi real-time
    emitNewRegistration(pendaftaran);

    res.status(201).json(pendaftaran);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update registration status (Admin only)
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;
      const pendaftaran = await prisma.pendaftaran.update({
        where: { id: req.params.id },
        data: { status },
        include: {
          pasien: { select: { id: true, name: true } },
        },
      });

      // Emit WebSocket event untuk update status real-time
      emitRegistrationStatusUpdate(
        pendaftaran.id,
        pendaftaran.status,
        pendaftaran.pasienId,
      );

      res.json(pendaftaran);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

module.exports = router;
