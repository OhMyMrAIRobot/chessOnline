import React, {useEffect, useState} from 'react';
import BoardComponent from "../components/BoardComponent";
import LostFigures from "../components/LostFigures";
import {Board} from "../models/Board";
import {Player} from "../models/Player";
import {Colors} from "../models/Colors";
import {useParams} from "react-router-dom";
import {sendMessage} from "../handlers/sendMessage";
import {messageHandler} from "../handlers/messageHandler";
import GameState from "../store/GameState";

const GamePage = () => {
    const [board, setBoard] = useState(new Board());
    const [socket, setSocket] = useState(new WebSocket(`ws://localhost:8080`))
    const [whitePlayer, setWhitePlayer] =
        useState<Player>(new Player(Colors.WHITE, socket, 1, 'user1'));

    const [blackPlayer, setBlackPlayer] = useState(new Player(Colors.BLACK, socket, 1, 'user2'));
    const [currentPlayer, setCurrentPlayer] = useState <Player | null>(null)

    const params = useParams();

    useEffect(() => {
        GameState.setSocket(socket)
        socket.onopen = () => {
            board.initCells();
            board.addFigures();
            console.log(board);
            sendMessage(socket, {method: 'connection', id: params.id, username: 'user1'});
            setCurrentPlayer(whitePlayer);
            messageHandler(socket, board, swapPlayer, currentPlayer, updateBoard);
        };
    }, [])

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    function swapPlayer(Player: Player) {
        setCurrentPlayer(
            currentPlayer && currentPlayer._color === Colors.WHITE ? blackPlayer : whitePlayer
        );
        console.log('swapped');
    }

    return (
        <div className = "app">
            <BoardComponent
                board={board}
                updateBoard={updateBoard}
                currentPlayer={currentPlayer}
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