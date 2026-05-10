const { Server } = require('socket.io');

let io;

module.exports = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-role', (role) => {
      if (role === 'admin' || role === 'kasir') socket.join('admin');
      if (role === 'kitchen') socket.join('kitchen');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports.getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};