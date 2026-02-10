const { z } = require('zod');

// --- User Validations ---

const registerUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["DOCTOR", "PATIENT"]).optional().default("PATIENT"),
});

const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// --- Poli Validations ---

const createPoliSchema = z.object({
  nama: z.string().min(1, "Nama Poli is required"),
  deskripsi: z.string().optional(),
});

const updatePoliSchema = z.object({
  nama: z.string().min(1, "Nama Poli is required").optional(),
  deskripsi: z.string().optional(),
});

// --- Dokter Validations ---

const createDokterSchema = z.object({
  nama: z.string().min(1, "Nama Dokter is required"),
  spesialis: z.string().min(1, "Spesialis is required"),
  poliId: z.string().uuid("Invalid Poli ID"),
});

const updateDokterSchema = z.object({
  nama: z.string().min(1, "Nama Dokter is required").optional(),
  spesialis: z.string().min(1, "Spesialis is required").optional(),
  poliId: z.string().uuid("Invalid Poli ID").optional(),
});

// --- JadwalDokter Validations ---

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/; // HH:mm format

const createJadwalSchema = z.object({
  dokterId: z.string().uuid("Invalid Dokter ID"),
  hari: z.string().min(1, "Hari is required"),
  jamMulai: z.string().regex(timeRegex, "Invalid time format (HH:mm)"),
  jamSelesai: z.string().regex(timeRegex, "Invalid time format (HH:mm)"),
});

const updateJadwalSchema = z.object({
  dokterId: z.string().uuid("Invalid Dokter ID").optional(),
  hari: z.string().min(1, "Hari is required").optional(),
  jamMulai: z.string().regex(timeRegex, "Invalid time format (HH:mm)").optional(),
  jamSelesai: z.string().regex(timeRegex, "Invalid time format (HH:mm)").optional(),
});

// --- Pendaftaran Validations ---

const createPendaftaranSchema = z.object({
  pasienId: z.string().uuid("Invalid Pasien ID"),
  jadwalId: z.string().uuid("Invalid Jadwal ID"),
  keluhan: z.string().optional(),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]).optional().default("PENDING"),
});

const updatePendaftaranStatusSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
  createPoliSchema,
  updatePoliSchema,
  createDokterSchema,
  updateDokterSchema,
  createJadwalSchema,
  updateJadwalSchema,
  createPendaftaranSchema,
  updatePendaftaranStatusSchema,
};