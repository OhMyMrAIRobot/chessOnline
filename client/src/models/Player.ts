import {Colors} from "./Colors";

export class Player{
    _color: Colors;
    _socket: WebSocket;
    _session: number;
    _username: string;

    constructor(color: Colors, socket: WebSocket, session: number, username: string) {
        this._color = color;
        this._socket = socket;
        this._session = session;
        this._username = username;
    }
}