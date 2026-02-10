const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");
const { z } = require("zod");

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

module.exports = router;
