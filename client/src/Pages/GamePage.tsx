import React, {useEffect, useState} from 'react';
import BoardComponent from "../components/BoardComponent";
import LostFigures from "../components/LostFigures";
import {Board} from "../models/Board";
import {Colors} from "../models/Colors";
import {useParams} from "react-router-dom";
import {sendMessage} from "../handlers/sendMessage";
import {messageHandler} from "../handlers/messageHandler";
import GameState from "../store/GameState";

const GamePage = () => {
    const [board, setBoard] = useState(new Board());
    const [socket, setSocket] = useState(new WebSocket(`ws://localhost:8080`))
    const [curMove, setCurMove] = useState<Colors | null>(null)

    useEffect(() => {
        messageHandler(socket, board, curMove, setCurMove, updateBoard);
    }, [curMove]);

    const params = useParams();

    useEffect(() => {
        GameState.setSocket(socket)
        GameState.setColor(params.color === 'White' ? Colors.WHITE : Colors.BLACK);
        board._blackPlayer = params.color !== 'White';
        socket.onopen = () => {
            board.initCells();
            board.addFigures();
            sendMessage(socket, {method: 'connection', id: params.id, username: 'user1'});
            setCurMove(Colors.WHITE);
        };
    }, [])

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    function swapPlayer() {
        setCurMove(curMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
       // GameState.setColor(GameState._color === Colors.WHITE ? Colors.BLACK : Colors.WHITE)
        console.log('swapped');
    }

    return (
        <div className = "app">
            <h5 style={{padding: '4px'}}>color: {GameState._color}</h5>
            <h5>move: {curMove}</h5>
            <BoardComponent
                board={board}
                updateBoard={updateBoard}
                curMove={curMove}
            />
            <div>
                <LostFigures
                    title={"Белые фигуры"}
                    figures={board._lostWhiteFigures}
                />
                <LostFigures
                    title={"Черные фигуры"}
                    figures={board._lostBlackFigures}
                />
            </div>
        </div>
    );
};

export default GamePage;