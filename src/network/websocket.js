import io from 'socket.io-client';

let socketInstance = null;

export const useSocketIo = (namespace) => {
  if (!socketInstance) {
    console.log("Criando nova instância de socket");
    socketInstance = io(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}${namespace ? '/' + namespace : ''}`, {
      withCredentials: false,
      autoConnect: true,
      reconnection: true
    });

    const initializeSocketListeners = () => {
      const pingInterval = setInterval(() => {
        console.log('PING');
        socketInstance.emit('ping');
      }, 30000);

      // Lidar com a resposta do "pong" do servidor
      socketInstance.on('pong', () => {
        console.log('PONG');
      });

      socketInstance.on("disconnect", (_) => {
        clearInterval(pingInterval);
        console.log('SOCKET Desconectado');
        socketInstance = null; // Define a instância como null após a desconexão
      });
    };

    initializeSocketListeners();
  }

  return socketInstance;
};
