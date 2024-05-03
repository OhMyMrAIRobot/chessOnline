import {Cell} from "../Models/Cell";
import {Board} from "../Models/Board";
import {Colors} from "../Models/Colors";
import GameState from "../Store/GameState";

interface MessageProps {
    method: string;
    username?: string;
    color?: string;
    cell?: Cell;
    selectedCell?: Cell;
    figure?: string;
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
    setDrawModalActive: (active: boolean) => void
    ) => {

    socket.onmessage = (event: MessageEvent) => {
        const msg: MessageProps = JSON.parse(event.data);
        switch (msg.method) {
            case 'connection':
                setMsgArray(prev => [...prev, {type: 'connect', user: msg.username}])
                if (msg.color === 'black') {
                    setCurMove(Colors.WHITE);
                }
                break;
            case 'move':
                if (msg.x0 !== undefined && msg.y0 !== undefined && msg.x1 !== undefined && msg.y1 !== undefined && curMove) {
                    board.moveAndChange(curMove, msg.x0, msg.y0, msg.x1, msg.y1, false);
                }
                updateBoard()
                setCurMove(curMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
                break;
            case 'moveAndChange':
                if (msg.x0 !== undefined && msg.y0 !== undefined && msg.x1 !== undefined && msg.y1 !== undefined && curMove){
                    board.moveAndChange(curMove, msg.x0, msg.y0, msg.x1, msg.y1, true, msg.figure);
                }
                updateBoard()
                setCurMove(curMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
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
                board.leftCastle(msg.color === 'white' ? Colors.WHITE : Colors.BLACK);
                updateBoard();
                setCurMove(curMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
                break;
            case 'rightCastle':
                board.rightCastle(msg.color === 'white' ? Colors.WHITE : Colors.BLACK);
                updateBoard();
                setCurMove(curMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
                break;
            case 'giveUp':
                GameState.setWinner(msg.color === 'white' ? Colors.BLACK : Colors.WHITE);
                setMsgArray(prev => [...prev, {type: 'giveUp', color: msg.color}])
                break;
            case 'offerDraw':
                setMsgArray(prev => [...prev, {type: 'offerDraw', color: msg.color}])
                GameState.setTimerActive(false);
                GameState.setTmpMove(curMove);
                setCurMove(null);
                if (msg.color !== GameState._color)
                    setDrawModalActive(true);
                break;
            case 'agreeDraw':
                setMsgArray(prev => [...prev, {type: 'agreeDraw', color: msg.color}])
                GameState.setDraw();
                setCurMove(null);
                break;
            case 'rejectDraw':
                setMsgArray(prev => [...prev, {type: 'rejectDraw', color: msg.color}])
                GameState.setTimerActive(true);
                setCurMove(GameState._tmpMove);
                break;
            case 'disconnect':
                setMsgArray(prev => [...prev, {type: 'disconnect', username: msg.username}])
                GameState.setWinner(msg.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
        }
    }
}