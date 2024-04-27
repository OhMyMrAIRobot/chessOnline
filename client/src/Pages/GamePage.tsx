import React, {useEffect, useState} from 'react';
import BoardComponent from "../components/BoardComponent";
import LostFigures from "../components/LostFigures";
import {Board} from "../models/Board";
import {Colors} from "../models/Colors";
import {useNavigate, useParams} from "react-router-dom";
import GameState from "../store/GameState";
import ChooseFigure from "../components/modals/ChooseFigureModal";
import {Cell} from "../models/Cell";
import {MessageHandler} from "../handlers/MessageHandler";
import {ValidateGameHandler} from "../handlers/ValidateGameHandler";
import UsernameModal from "../components/modals/UsernameModal";

const GamePage = () => {
    const [board, setBoard] = useState(new Board());
    const [socket, setSocket] = useState(new WebSocket(`ws://localhost:8080`));
    const [curMove, setCurMove] = useState<Colors | null>(null);
    const [usernameModalActive, setUsernameModalActive] = useState<boolean>(true)
    const [figureModalActive, setFigureModalActive] = useState<boolean>(false)
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const [cell, setCell] = useState<Cell | null>(null);

    useEffect(() => {
        MessageHandler(socket, board, curMove, setCurMove, updateBoard)
    }, [curMove]);

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(params);
        ValidateGameHandler(params.id).then(result => {
            if (!result || !(params.color === 'White' || params.color === 'Black'))
                navigate(`/`)
        }).catch(() => {
            navigate(`/`)
        })

        GameState.setSocket(socket)
        GameState.setColor(params.color === 'White' ? Colors.WHITE : Colors.BLACK);
        socket.onopen = () => {
            board.initCells();
            board.addFigures();
        };
    }, [])

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    return (
        <div className="app">
            <UsernameModal
                modalActive={usernameModalActive}
                setModalActive={setUsernameModalActive}
            />
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