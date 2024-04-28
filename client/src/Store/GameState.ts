import {makeAutoObservable} from "mobx";
import {Colors} from "../Models/Colors";

export {}

class GameState {
    _username:string = "";
    _color: Colors | null = null;
    _socket: any;
    _session: string = "";
    _winner: Colors | null = null;

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

    setWinner(color: Colors | null) {
        this._winner = color;
    }

    setSession(id: string){
        this._session = id;
    }

}
export default new GameState()
