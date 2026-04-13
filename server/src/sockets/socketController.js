export const socketController = (socket, io) => {

  socket.on('unirse-sala', (id_usuario) => {
    socket.join(`usuario-${id_usuario}`);
    console.log(`Usuario ${id_usuario} se unio a su sala`);
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });

};