import {Cell} from "../Models/Cell";
import {Board} from "../Models/Board";
import {Colors} from "../Models/Colors";
import GameState from "../Store/GameState";
import {Queen} from "../Models/figures/Queen";
import {Bishop} from "../Models/figures/Bishop";
import {Knight} from "../Models/figures/Knight";
import {Pawn} from "../Models/figures/Pawn";
import {Rook} from "../Models/figures/Rook";
import {King} from "../Models/figures/King";

interface MessageProps {
    method: string;
    username?: string;
    color?: string;
    cell?: Cell;
    selectedCell?: Cell;
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
    data?:string;
    time?: any;
}

export const MessageHandler = (
    socket: WebSocket,
    board: Board,
    curMove: Colors | null,
    setCurMove: (color: Colors | null) => void,
    updateBoard: () => void,
    setMsgArray: (update: (prevMsgArray: any[]) => any[]) => void,
    ) => {

    const moveAndChange = (msg: any, change: boolean) => {
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
            if (change && cell._figure) {
                switch (msg.figure){
                    case 'Bishop':
                        cell._figure = new Bishop(cell._figure._color, cell);
                        break;
                    case 'Knight':
                        cell._figure = new Knight(cell._figure._color, cell);
                        break;
                    case 'Pawn':
                        cell._figure = new Pawn(cell._figure._color, cell);
                        break;
                    case 'Queen':
                        cell._figure = new Queen(cell._figure._color, cell);
                        break;
                    case 'Rook':
                        cell._figure = new Rook(cell._figure._color, cell);
                        break;
                }
            }
            updateBoard()
            setCurMove(curMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
        }
    }

    const moveRookAndKing = (oldRookCell: Cell, oldKingCell: Cell, newRookCell: Cell, newKingCell: Cell, rookColor: Colors) => {
        oldRookCell._figure = null;
        oldKingCell._figure = null;
        newRookCell._figure = new Rook(rookColor, newRookCell);
        newKingCell._figure = new King(rookColor, newKingCell);
    };

    const leftCastle = (color: Colors) => {
        const rookColor = color === Colors.WHITE ? Colors.WHITE : Colors.BLACK;

        if (GameState._color === Colors.WHITE) {
            if (color === Colors.WHITE) {
                moveRookAndKing(board.getCell(0, 7), board.getCell(4, 7), board.getCell(3, 7), board.getCell(2, 7), rookColor);
            } else {
                moveRookAndKing(board.getCell(7, 0), board.getCell(4, 0), board.getCell(5, 0), board.getCell(6, 0), rookColor);
            }
        } else {
            if (color === Colors.WHITE) {
                moveRookAndKing(board.getCell(7, 0), board.getCell(3, 0), board.getCell(4, 0), board.getCell(5, 0), rookColor);
            } else {
                moveRookAndKing(board.getCell(0, 7), board.getCell(3, 7), board.getCell(2, 7), board.getCell(1, 7), rookColor);
            }
        }
        updateBoard();
        setCurMove(curMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
    };

    const rightCastle = (color: Colors) => {
        const rookColor = color === Colors.WHITE ? Colors.WHITE : Colors.BLACK;
        if (GameState._color === Colors.WHITE) {
            if (color === Colors.WHITE) {
                moveRookAndKing(board.getCell(7, 7), board.getCell(4, 7), board.getCell(5, 7), board.getCell(6, 7), rookColor);
            } else {
                moveRookAndKing(board.getCell(0, 0), board.getCell(4, 0), board.getCell(3, 0), board.getCell(2, 0), rookColor);
            }
        } else {
            if (color === Colors.WHITE) {
                moveRookAndKing(board.getCell(0, 0), board.getCell(3, 0), board.getCell(2, 0), board.getCell(1, 0), rookColor);
            } else {
                moveRookAndKing(board.getCell(7, 7), board.getCell(3, 7), board.getCell(4, 7), board.getCell(5, 7), rookColor);
            }
        }
        updateBoard();
        setCurMove(curMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
    }

    socket.onmessage = (event: MessageEvent) => {
        const msg: MessageProps = JSON.parse(event.data);
        switch (msg.method) {
            case 'connection':
                setMsgArray(prev => [...prev, {type: 'connect', user: msg.username}])
                if (msg.color === 'black'){
                    setCurMove(Colors.WHITE);
                }
                 break;
            case 'move':
                moveAndChange(msg, false);
                const checkColor = curMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE
                if (curMove && board.checkMate(checkColor))
                    GameState.setWinner(curMove)
                break;
            case 'moveAndChange':
                moveAndChange(msg, true)
                break;
            case 'message':
                setMsgArray(prev => [...prev, {
                    type: 'message',
                    user: msg.username,
                    text: msg.data,
                    time: {hour: msg.time.hour, minute: msg.time.minute}
                }])
                break;
            case 'leftCastle':
                leftCastle(msg.color === 'white' ? Colors.WHITE : Colors.BLACK);
                break;
            case 'rightCastle':
                rightCastle(msg.color === 'white' ? Colors.WHITE : Colors.BLACK);
                break;
            case 'giveUp':
                console.log(msg.color);
                GameState.setWinner(msg.color === 'white' ? Colors.BLACK : Colors.WHITE);
                break;
        }
    }
}