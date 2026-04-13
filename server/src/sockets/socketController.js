export const socketController = (socket, io) => {

  socket.on('unirse-sala', (id_usuario) => {
    socket.join(`usuario-${id_usuario}`);
  });

  socket.on('disconnect', () => {});

};