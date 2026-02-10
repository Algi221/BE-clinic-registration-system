const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data (dalam urutan yang benar untuk foreign keys)
  await prisma.pendaftaran.deleteMany();
  await prisma.jadwalDokter.deleteMany();
  await prisma.dokter.deleteMany();
  await prisma.poli.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared existing data");

  // ==========================================
  // CREATE POLI (4 Poli)
  // ==========================================
  const poliUmum = await prisma.poli.create({
    data: { nama: "Poli Umum", deskripsi: "Pelayanan kesehatan umum" },
  });

  const poliGigi = await prisma.poli.create({
    data: { nama: "Poli Gigi", deskripsi: "Kesehatan gigi dan mulut" },
  });

  const poliKandungan = await prisma.poli.create({
    data: { nama: "Poli Kandungan", deskripsi: "Kesehatan ibu dan anak" },
  });

  const poliGizi = await prisma.poli.create({
    data: { nama: "Poli Gizi", deskripsi: "Konsultasi gizi dan nutrisi" },
  });

  const poliKecantikan = await prisma.poli.create({
    data: {
      nama: "Poli Kecantikan",
      deskripsi: "Perawatan kulit dan kecantikan",
    },
  });

  console.log("✅ Created 5 Poli");

  // ==========================================
  // CREATE USERS (DOCTORS)
  // ==========================================
  const defaultPassword = await bcrypt.hash("dokter123", 10);

  const userArden = await prisma.user.create({
    data: {
      name: "Dr. Arden",
      email: "arden@gmail.com",
      password: defaultPassword,
      role: "DOCTOR",
    },
  });

  const userAlip = await prisma.user.create({
    data: {
      name: "Dr. Alip",
      email: "alip@gmail.com",
      password: defaultPassword,
      role: "DOCTOR",
    },
  });

  const userAlgi = await prisma.user.create({
    data: {
      name: "Dr. Algi",
      email: "algi@gmail.com",
      password: defaultPassword,
      role: "DOCTOR",
    },
  });

  const userChika = await prisma.user.create({
    data: {
      name: "Dr. Chika",
      email: "chika@gmail.com",
      password: defaultPassword,
      role: "DOCTOR",
    },
  });

  const userHumayra = await prisma.user.create({
    data: {
      name: "Dr. Humayra",
      email: "humayra@gmail.com",
      password: defaultPassword,
      role: "DOCTOR",
    },
  });

  // Legacy doctor (untuk backward compatibility)
  const userDokter = await prisma.user.create({
    data: {
      name: "Dr. Ahmad",
      email: "dokter@klinik.com",
      password: defaultPassword,
      role: "DOCTOR",
    },
  });

  console.log("✅ Created 6 Doctor Users");

  // ==========================================
  // CREATE PATIENT USER
  // ==========================================
  const patientPassword = await bcrypt.hash("patient123", 10);
  const patient = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "budi@gmail.com",
      password: patientPassword,
      role: "PATIENT",
    },
  });

  console.log("✅ Created 1 Patient User");

  // ==========================================
  // CREATE DOKTER PROFILES (LINKED TO USERS & POLI)
  // ==========================================
  const drArden = await prisma.dokter.create({
    data: {
      userId: userArden.id,
      nama: "Dr. Arden",
      spesialis: "Dokter Kecantikan",
      poliId: poliKecantikan.id,
    },
  });

  const drAlip = await prisma.dokter.create({
    data: {
      userId: userAlip.id,
      nama: "Dr. Alip",
      spesialis: "Dokter Kandungan",
      poliId: poliKandungan.id,
    },
  });

  const drAlgi = await prisma.dokter.create({
    data: {
      userId: userAlgi.id,
      nama: "Dr. Algi",
      spesialis: "Dokter Umum",
      poliId: poliUmum.id,
    },
  });

  const drChika = await prisma.dokter.create({
    data: {
      userId: userChika.id,
      nama: "Dr. Chika",
      spesialis: "Dokter Gigi",
      poliId: poliGigi.id,
    },
  });

  const drHumayra = await prisma.dokter.create({
    data: {
      userId: userHumayra.id,
      nama: "Dr. Humayra",
      spesialis: "Ahli Gizi",
      poliId: poliGizi.id,
    },
  });

  // Legacy doctor
  const drAhmad = await prisma.dokter.create({
    data: {
      userId: userDokter.id,
      nama: "Dr. Ahmad",
      spesialis: "Dokter Umum",
      poliId: poliUmum.id,
    },
  });

  console.log("✅ Created 6 Dokter Profiles (linked to Users & Poli)");

  // ==========================================
  // CREATE JADWAL DOKTER
  // ==========================================
  await prisma.jadwalDokter.createMany({
    data: [
      // Dr. Arden (Kecantikan)
      {
        dokterId: drArden.id,
        hari: "Senin",
        jamMulai: "09:00",
        jamSelesai: "15:00",
      },
      {
        dokterId: drArden.id,
        hari: "Rabu",
        jamMulai: "09:00",
        jamSelesai: "15:00",
      },

      // Dr. Alip (Kandungan)
      {
        dokterId: drAlip.id,
        hari: "Selasa",
        jamMulai: "08:00",
        jamSelesai: "14:00",
      },
      {
        dokterId: drAlip.id,
        hari: "Kamis",
        jamMulai: "08:00",
        jamSelesai: "14:00",
      },

      // Dr. Algi (Umum)
      {
        dokterId: drAlgi.id,
        hari: "Senin",
        jamMulai: "08:00",
        jamSelesai: "12:00",
      },
      {
        dokterId: drAlgi.id,
        hari: "Rabu",
        jamMulai: "13:00",
        jamSelesai: "17:00",
      },

      // Dr. Chika (Gigi)
      {
        dokterId: drChika.id,
        hari: "Selasa",
        jamMulai: "13:00",
        jamSelesai: "17:00",
      },
      {
        dokterId: drChika.id,
        hari: "Jumat",
        jamMulai: "09:00",
        jamSelesai: "13:00",
      },

      // Dr. Humayra (Gizi)
      {
        dokterId: drHumayra.id,
        hari: "Rabu",
        jamMulai: "10:00",
        jamSelesai: "14:00",
      },
      {
        dokterId: drHumayra.id,
        hari: "Sabtu",
        jamMulai: "08:00",
        jamSelesai: "12:00",
      },

      // Dr. Ahmad (Umum - Legacy)
      {
        dokterId: drAhmad.id,
        hari: "Kamis",
        jamMulai: "08:00",
        jamSelesai: "12:00",
      },
    ],
  });

  console.log("✅ Created Jadwal Dokter");

  // ==========================================
  // SUMMARY
  // ==========================================
  console.log("\n📊 SEED SUMMARY:");
  console.log("=====================================");
  console.log("👥 Users:");
  console.log("   - Doctors: 6");
  console.log("   - Patients: 1");
  console.log("\n🏥 Poli:");
  console.log("   - Poli Umum");
  console.log("   - Poli Gigi");
  console.log("   - Poli Kandungan");
  console.log("   - Poli Gizi");
  console.log("   - Poli Kecantikan");
  console.log("\n👨‍⚕️ Dokter Mapping:");
  console.log("   - arden@gmail.com → Poli Kecantikan");
  console.log("   - alip@gmail.com → Poli Kandungan");
  console.log("   - algi@gmail.com → Poli Umum");
  console.log("   - chika@gmail.com → Poli Gigi");
  console.log("   - humayra@gmail.com → Poli Gizi");
  console.log("   - dokter@klinik.com → Poli Umum (Legacy)");
  console.log("\n🔐 Default Password:");
  console.log("   - Doctors: dokter123");
  console.log("   - Patients: patient123");
  console.log("=====================================\n");
  console.log("✅ Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
