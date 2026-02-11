const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");
const { z } = require("zod");
const { authMiddleware } = require("../middleware/auth");

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["DOCTOR", "PATIENT"]).optional(),
});

router.post("/register", async (req, res) => {
  try {
    console.log("📥 Register request received:", req.body);

    const { name, email, password, role } = registerSchema.parse(req.body);

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "PATIENT",
      },
    });

    console.log("✅ User registered successfully:", user.email);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    console.error("Error details:", error);
    res.status(400).json({ message: error.message || "Validation failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with dokter relation (if role is DOCTOR)
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        dokter: {
          include: {
            poli: true, // Include poli info for doctors
          },
        },
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Prepare response with dokter & poli info (if doctor)
    const responseData = {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    // If user is DOCTOR, include dokter profile and poli
    if (user.role === "DOCTOR" && user.dokter) {
      responseData.user.dokter = {
        id: user.dokter.id,
        nama: user.dokter.nama,
        spesialis: user.dokter.spesialis,
        poli: {
          id: user.dokter.poli.id,
          nama: user.dokter.poli.nama,
        },
      };
    }

    res.json(responseData);
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    console.log("📥 Update profile request:", req.body);

    // Update User
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone, address },
      include: {
        dokter: {
          include: { poli: true },
        },
      },
    });

    // If user is DOCTOR, update Dokter name too
    if (updatedUser.role === "DOCTOR" && updatedUser.dokter) {
      await prisma.dokter.update({
        where: { id: updatedUser.dokter.id },
        data: { nama: name },
      });
    }

    console.log("✅ Profile updated:", updatedUser.email);

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        dokter: updatedUser.dokter
          ? {
              id: updatedUser.dokter.id,
              nama: updatedUser.dokter.nama,
              spesialis: updatedUser.dokter.spesialis,
              poli: updatedUser.dokter.poli,
            }
          : undefined,
      },
    });
  } catch (error) {
    console.error("❌ Profile update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

const upload = require("../middleware/upload");

router.patch("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ message: "Password saat ini salah" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password berhasil diubah" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/change-email", authMiddleware, async (req, res) => {
  try {
    const { newEmail, password } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Password salah" });
    }

    const emailExists = await prisma.user.findUnique({
      where: { email: newEmail },
    });
    if (emailExists) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { email: newEmail },
    });

    res.json({
      message: "Email berhasil diubah",
      user: { ...updatedUser, password: undefined }, // Return updated user without password
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Tidak ada file yang diupload" });
      }

      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

      // Update user avatar in DB
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { avatar: avatarUrl },
      });

      res.json({
        message: "Foto profil berhasil diubah",
        avatarUrl,
        user: { ...updatedUser, password: undefined },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

module.exports = router;
