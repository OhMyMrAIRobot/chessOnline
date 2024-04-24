import {Cell} from "../models/Cell";
import {Board} from "../models/Board";
import {Colors} from "../models/Colors";
import GameState from "../store/GameState";

interface Message {
    method: string;
    username?: string;
    cell?: Cell;
    selectedCell?: Cell;
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
}

export const messageHandler = (
    socket: WebSocket,
    board: Board,
    curMove: Colors | null,
    setCurMove: (color: Colors | null) => void,
    updateBoard: () => void,
    ) => {
    socket.onmessage = (event: MessageEvent) => {
        const msg: Message = JSON.parse(event.data);
        switch (msg.method) {
            case 'connection':
                break;
            case 'move':
                let selectedCell: Cell;
                let cell: Cell;
                if (msg.x0 !== undefined && msg.y0 !== undefined && msg.x1 !== undefined && msg.y1 !== undefined){
                    if (curMove === GameState._color){
                        selectedCell = board.getCell(msg.x0, msg.y0);
                        cell = board.getCell(msg.x1, msg.y1);
                    } else {
                        selectedCell = board.getCell(7 - msg.x0, 7 - msg.y0);
                        cell = board.getCell(7 - msg.x1, 7 - msg.y1);
                    }
                    selectedCell.moveFigure(cell);
                    updateBoard()
                    setCurMove(curMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
                    console.log(curMove);
                }
                break;
        }
    }
}