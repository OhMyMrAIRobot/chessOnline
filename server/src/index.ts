import dotenv from "dotenv";
import WebSocket from 'ws';

dotenv.config();

const wss = new WebSocket.Server({ port: 8080 });

interface WebSocketWithId extends WebSocket {
    id: number;
}

wss.on('connection', (ws: WebSocketWithId) => {
    ws.on('message', (msg: any) => {
        msg = JSON.parse(msg);
        switch (msg.method) {
            case 'connection':
                connectionHandler(ws, msg);
                break;
            case 'move':
                console.log(msg);
                broadcast(ws, msg);
                break;
        }
    });
});

const broadcast = (ws: WebSocketWithId, msg: { id: number; data: any }) => {
    wss.clients.forEach((client) => {
        if ((client as WebSocketWithId).id === msg.id) {
            (client as WebSocketWithId).send(JSON.stringify(msg));
        }
    });
};

const connectionHandler = (ws: WebSocketWithId, msg: { id: number, data: any }) => {
    (ws as WebSocketWithId).id = msg.id;
    broadcast(ws, msg);
};

