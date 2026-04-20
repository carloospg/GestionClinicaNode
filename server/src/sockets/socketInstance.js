let io = null;

export const setIO = (ioInstance) => {
    io = ioInstance;
}

export const getIO = () => {
    if (!io) {
        throw new Error('SocketIO no ha sido iniciado')
    }
    return io;
}