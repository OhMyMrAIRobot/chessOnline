import {makeAutoObservable} from "mobx";
import {Colors} from "../models/Colors";

export {}

class GameState {
    _username:string = "";
    _color: Colors | null = null;
    _socket: any;
    _session: number = -1;

    constructor() {
        makeAutoObservable(this)
    }

    setUsername(username: string){
        this._username = username;
    }

    setColor(color: Colors){
        this._color = color;
    }

    setSocket(socket: WebSocket){
        this._socket = socket;
    }

    setSession(id: number){
        this._session = id;
    }

}
export default new GameState()
