const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { initSocket } = require("./src/utils/socket");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static("public/uploads"));

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/poli", require("./src/routes/poli"));
app.use("/api/dokter", require("./src/routes/dokter"));
app.use("/api/jadwal", require("./src/routes/jadwal"));
app.use("/api/pendaftaran", require("./src/routes/pendaftaran"));

// Root route
app.get("/", (req, res) => {
  res.send("API OceanCare is running...");
});

// Initialize Socket.io with the server instance
initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
