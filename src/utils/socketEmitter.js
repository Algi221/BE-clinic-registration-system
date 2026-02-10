const { getSocketIO } = require("./socket");

/**
 * Emit event ke semua client yang terhubung
 */
const emitToAll = (event, data) => {
  const io = getSocketIO();
  if (io) {
    io.emit(event, data);
  }
};

/**
 * Emit event ke room tertentu (misalnya: 'doctor', 'patient', 'admin')
 */
const emitToRoom = (room, event, data) => {
  const io = getSocketIO();
  if (io) {
    io.to(room).emit(event, data);
  }
};

/**
 * Emit event khusus untuk pendaftaran baru
 */
const emitNewRegistration = (registrationData) => {
  // Kirim ke semua dokter
  emitToRoom("doctor", "new-registration", {
    message: "Pendaftaran baru masuk!",
    data: registrationData,
  });

  // Kirim ke admin jika ada
  emitToRoom("admin", "new-registration", {
    message: "Pendaftaran baru masuk!",
    data: registrationData,
  });
};

/**
 * Emit event saat status pendaftaran berubah
 */
const emitRegistrationStatusUpdate = (registrationId, status, patientId) => {
  // Kirim ke patient yang bersangkutan
  emitToRoom(`patient-${patientId}`, "registration-status-update", {
    registrationId,
    status,
    message: `Status pendaftaran Anda telah diubah menjadi: ${status}`,
  });

  // Kirim juga ke semua dokter
  emitToRoom("doctor", "registration-status-update", {
    registrationId,
    status,
  });
};

/**
 * Emit event saat antrian dipanggil
 */
const emitQueueCall = (queueData) => {
  // Kirim ke patient yang dipanggil
  if (queueData.patientId) {
    emitToRoom(`patient-${queueData.patientId}`, "queue-called", {
      message: "Nomor antrian Anda dipanggil!",
      data: queueData,
    });
  }

  // Broadcast ke semua (untuk display antrian)
  emitToAll("queue-update", queueData);
};

module.exports = {
  emitToAll,
  emitToRoom,
  emitNewRegistration,
  emitRegistrationStatusUpdate,
  emitQueueCall,
};
