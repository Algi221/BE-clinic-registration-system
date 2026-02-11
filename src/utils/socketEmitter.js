const { getIO } = require("./socket");

const emitNewRegistration = (data) => {
  try {
    const io = getIO();
    io.emit("new_registration", data);
  } catch (error) {
    console.error("Socket emit error:", error);
  }
};

const emitRegistrationStatusUpdate = (id, status, pasienId) => {
  try {
    const io = getIO();
    io.emit("registration_status_update", { id, status, pasienId });
  } catch (error) {
    console.error("Socket emit error:", error);
  }
};

module.exports = { emitNewRegistration, emitRegistrationStatusUpdate };
