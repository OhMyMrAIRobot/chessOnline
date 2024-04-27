import React, {useEffect, useState} from 'react';
import BoardComponent from "../components/BoardComponent";
import LostFigures from "../components/LostFigures";
import {Board} from "../models/Board";
import {Colors} from "../models/Colors";
import {useNavigate, useParams} from "react-router-dom";
import {SendMessage} from "../handlers/SendMessage";
import GameState from "../store/GameState";
import ChooseFigure from "../components/ChooseFigureModal";
import {Cell} from "../models/Cell";
import {MessageHandler} from "../handlers/MessageHandler";
import {ValidateGameHandler} from "../handlers/ValidateGameHandler";

const GamePage = () => {
    const [board, setBoard] = useState(new Board());
    const [socket, setSocket] = useState(new WebSocket(`ws://localhost:8080`));
    const [curMove, setCurMove] = useState<Colors | null>(null);

    useEffect(() => {
        MessageHandler(socket, board, curMove, setCurMove, updateBoard)
    }, [curMove]);

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        ValidateGameHandler(params.id).then(result => {
            if (!result)
                navigate(`/`)
        }).catch((e) => {
            console.log(e);
            navigate(`/`)
        })

        GameState.setSocket(socket)
        GameState.setColor(params.color === 'White' ? Colors.WHITE : Colors.BLACK);
        board._blackPlayer = params.color !== 'White';
        socket.onopen = () => {
            board.initCells();
            board.addFigures();
            SendMessage(socket, {method: 'connection', id: params.id, username: 'user1'});
            setCurMove(Colors.WHITE);
        };
    }, [])

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    const [figureModalActive, setFigureModalActive] = useState<boolean>(false)
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const [cell, setCell] = useState<Cell | null>(null);

    return (
        <div className="app">
            <ChooseFigure
                modalActive={figureModalActive}
                setModalActive={setFigureModalActive}
                selectedCell={selectedCell}
                cell={cell}
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
            <BoardComponent
                board={board}
                updateBoard={updateBoard}
                curMove={curMove}
                setFigureModalActive={setFigureModalActive}
                setSelectedCellOut={setSelectedCell}
                setCell={setCell}
            />
        </div>
    );
};

export default GamePage;