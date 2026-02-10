const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
const authRoutes = require("./src/routes/auth");
const poliRoutes = require("./src/routes/poli");
const dokterRoutes = require("./src/routes/dokter");
const jadwalRoutes = require("./src/routes/jadwal");
const pendaftaranRoutes = require("./src/routes/pendaftaran");

app.use("/api/auth", authRoutes);
app.use("/api/poli", poliRoutes);
app.use("/api/dokter", dokterRoutes);
app.use("/api/jadwal", jadwalRoutes);
app.use("/api/pendaftaran", pendaftaranRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Clinic Registration API" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { prisma };
