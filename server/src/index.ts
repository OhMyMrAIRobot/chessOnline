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

const Games: Array<string> = [];

app.post('/createGame', (req, res) => {
    try {
        const id: string = req.body.id;
        Games.push(id);
        return res.status(200).json({message: "Game created"})
    } catch (e) {
        return res.status(500).json({message: e})
    }
})

app.get('/getGame', (req, res) => {
    try{
        const id: any = req.query.id;
        if (Games.includes(id)) {
            return res.status(200).json({message: 'Game exists'})
        } else
            return res.status(404).json({message: 'Game doesn\'t exist'})
    } catch (e) {
        return res.status(500).json({message: e})
    }
})

wss.on('connection', (ws: WebSocketWithId) => {
    ws.on('message', (msg: any) => {
        msg = JSON.parse(msg);
        console.log(msg);
        switch (msg.method) {
            case 'connection':
                connectionHandler(ws, msg);
                break;
            case 'move':
                broadcast(ws, msg);
                break;
            case 'message':
                broadcast(ws,msg);
                break;
            case 'moveAndChange':
                broadcast(ws, msg);
                break;
            case 'leftCastle':
                broadcast(ws,msg);
                break;
            case 'rightCastle':
                broadcast(ws,msg);
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
const HOST = 'localhost'
server.listen(PORT, HOST,  () => {
    console.log(`Server is running on port ${PORT}`);
});
