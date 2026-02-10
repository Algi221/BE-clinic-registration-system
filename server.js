const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const http = require("http");
const { Server } = require("socket.io");
const { setSocketIO } = require("./src/utils/socket");

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

// Socket.IO setup dengan CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Set socket instance agar bisa diakses dari module lain
setSocketIO(io);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Join room berdasarkan role
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  // Leave room
  socket.on("leave-room", (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Routes - Import setelah socket diset untuk menghindari circular dependency
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

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server is ready`);
});

module.exports = { prisma };
