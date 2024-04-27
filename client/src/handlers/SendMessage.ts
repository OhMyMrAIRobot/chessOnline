export const SendMessage = (socket: WebSocket, msg: any): void => {
    socket.send(JSON.stringify(msg));
};
