export const sendMessage = (socket: WebSocket, msg: any): void => {
    socket.send(JSON.stringify(msg));
};