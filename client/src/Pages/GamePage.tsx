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
    const params = useParams();

    useEffect(() => {
        GameState.setSocket(socket)
        GameState.setColor(Colors.WHITE)
        socket.onopen = () => {
            board.initCells();
            board.addFigures();
            console.log(board);
            sendMessage(socket, {method: 'connection', id: params.id, username: 'user1'});
            setCurMove(Colors.WHITE);
            messageHandler(socket, board, swapPlayer, updateBoard);
        };
    }, [])

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    function swapPlayer() {
        setCurMove(GameState._color === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
        GameState.setColor(GameState._color === Colors.WHITE ? Colors.BLACK : Colors.WHITE)
        console.log('swapped');
    }

    return (
        <div className = "app">
            <BoardComponent
                board={board}
                updateBoard={updateBoard}
                curMove={curMove}
                swapPlayer={swapPlayer}
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