import dotenv from "dotenv";
import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors from 'cors';

dotenv.config();


const app = express();
app.use(cors())
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

interface WebSocketWithId extends WebSocket {
    id: number;
}

app.use(express.json());
app.use(cors())

app.post('/createGame', (req, res) => {
    try {
        const id: any = req.query.id;
        Games.push(id);

        return res.status(200).json({message: "Game created"})
    } catch (e) {
        return res.status(500).json({message: e})
    }
})

const Games: Array<string> = [];

wss.on('connection', (ws: WebSocketWithId) => {
    ws.on('message', (msg: any) => {
        msg = JSON.parse(msg);
        switch (msg.method) {
            case 'connection':
                connectionHandler(ws, msg);
                break;
            case 'move':
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

const PORT = 8080;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
