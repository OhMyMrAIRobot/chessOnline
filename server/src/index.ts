import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http from 'http';
import WebSocket from 'ws';

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = process.env.PORT || 3001;

interface WebSocketWithId extends WebSocket {
    id: string;
}

wss.on('/', (ws: WebSocketWithId) => {
    ws.on('message', (msg: any) => {
        msg = JSON.parse(msg.toString());
        switch (msg.method) {
            case 'connection':
                connectionHandler(ws, msg);
                break;
        }
    });
});

const broadcast = (ws: WebSocketWithId, msg: { id: string; data: any }) => {
    wss.clients.forEach((client) => {
        if ((client as WebSocketWithId).id === msg.id) {
            (client as WebSocketWithId).send(JSON.stringify(msg));
        }
    });
};

const connectionHandler = (ws: WebSocketWithId, msg: { id: string, data: any }) => {
    (ws as WebSocketWithId).id = msg.id;
    broadcast(ws, msg);
};

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});