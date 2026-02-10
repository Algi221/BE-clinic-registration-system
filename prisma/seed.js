const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.pendaftaran.deleteMany();
  await prisma.jadwalDokter.deleteMany();
  await prisma.dokter.deleteMany();
  await prisma.poli.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminPassword = await bcrypt.hash("admin123", 10);
  const patientPassword = await bcrypt.hash("patient123", 10);

  await prisma.user.create({
    data: {
      name: "Admin Klinik",
      email: "admin@klinik.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const patient = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "budi@gmail.com",
      password: patientPassword,
      role: "PATIENT",
    },
  });

  // Create Poli
  const poliUmum = await prisma.poli.create({
    data: { nama: "Poli Umum", deskripsi: "Pelayanan kesehatan umum" },
  });

  const poliGigi = await prisma.poli.create({
    data: { nama: "Poli Gigi", deskripsi: "Kesehatan gigi dan mulut" },
  });

  // Create Dokter
  const drAndi = await prisma.dokter.create({
    data: { nama: "dr. Andi", spesialis: "Dokter Umum", poliId: poliUmum.id },
  });

  const drSiska = await prisma.dokter.create({
    data: { nama: "drg. Siska", spesialis: "Dokter Gigi", poliId: poliGigi.id },
  });

  // Create Jadwal
  await prisma.jadwalDokter.createMany({
    data: [
      {
        dokterId: drAndi.id,
        hari: "Senin",
        jamMulai: "08:00",
        jamSelesai: "12:00",
      },
      {
        dokterId: drAndi.id,
        hari: "Selasa",
        jamMulai: "08:00",
        jamSelesai: "12:00",
      },
      {
        dokterId: drSiska.id,
        hari: "Senin",
        jamMulai: "13:00",
        jamSelesai: "17:00",
      },
      {
        dokterId: drSiska.id,
        hari: "Rabu",
        jamMulai: "13:00",
        jamSelesai: "17:00",
      },
    ],
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
