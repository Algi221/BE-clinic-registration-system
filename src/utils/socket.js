/**
 * Socket instance holder
 * Ini menghindari circular dependency dengan menyimpan io instance
 */
let io = null;

const setSocketIO = (socketInstance) => {
  io = socketInstance;
};

const getSocketIO = () => {
  if (!io) {
    console.warn("Socket.IO instance not initialized yet");
  }
  return io;
};

module.exports = {
  setSocketIO,
  getSocketIO,
};
