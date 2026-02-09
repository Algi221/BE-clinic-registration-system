const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const registrations = [];

// Basic Route
app.get("/", (req, res) => {
  res.send("Klinik Registration API is running...");
});

// Get all registrations
app.get("/api/registrations", (req, res) => {
  res.json(registrations);
});

// Patients Registration Route
app.post("/api/register", (req, res) => {
  const { name, symptom, phone, date } = req.body;

  if (!name || !symptom || !phone) {
    return res
      .status(400)
      .json({
        message: "Please provide all required fields (name, symptom, phone)",
      });
  }

  const newRegistration = {
    id: registrations.length + 1,
    name,
    symptom,
    phone,
    date: date || new Date().toLocaleString(),
    status: "Pending",
  };

  registrations.push(newRegistration);
  console.log("New Registration:", newRegistration);
  res
    .status(201)
    .json({ message: "Registration successful", data: newRegistration });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
