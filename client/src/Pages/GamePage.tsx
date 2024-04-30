import React, {useEffect, useState} from 'react';
import BoardComponent from "../Components/BoardComponent";
import LostFigures from "../Components/LostFigures";
import {Board} from "../Models/Board";
import {Colors} from "../Models/Colors";
import {useNavigate, useParams} from "react-router-dom";
import GameState from "../Store/GameState";
import ChooseFigureModal from "../Components/modals/ChooseFigureModal";
import {Cell} from "../Models/Cell";
import {MessageHandler} from "../Handlers/MessageHandler";
import {ValidateGameHandler} from "../Handlers/ValidateGameHandler";
import UsernameModal from "../Components/modals/UsernameModal";
import gameState from "../Store/GameState";
import EndGameModal from "../Components/modals/EndGameModal";
import Chat from "../Components/ChatComponent";

const GamePage = () => {
    // Modals
    const [usernameModalActive, setUsernameModalActive] = useState<boolean>(true)
    const [figureModalActive, setFigureModalActive] = useState<boolean>(false)
    const [endModalActive, setEndModalActive] = useState<boolean>(false)

    const [board, setBoard] = useState(new Board());
    const [socket, setSocket] = useState(new WebSocket(`ws://localhost:8080`));
    const [curMove, setCurMove] = useState<Colors | null>(null);
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const [cell, setCell] = useState<Cell | null>(null);
    const [msgArray, setMsgArray] = useState<any[]>([])

    useEffect(() => {
        MessageHandler(socket, board, curMove, setCurMove, updateBoard, setMsgArray)
    }, [curMove]);

    useEffect(() => {
        if (gameState._winner) setEndModalActive(true);
    }, [GameState._winner]);

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        ValidateGameHandler(params.id)
            .then(result => {
                if (!result || !(params.color === 'White' || params.color === 'Black'))
                    navigate(`/`)
            })
            .catch(() => {
                navigate(`/`)
        })

        GameState.setSocket(socket)
        GameState.setColor(params.color === 'White' ? Colors.WHITE : Colors.BLACK);
        if (params.id) GameState.setSession(params.id)

        socket.onopen = () => {
            board.initCells();
            board.addFigures();
            setCurMove(Colors.WHITE);
        };
    }, [])

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    return (
        <div className="app">
            <h3>Your move</h3>
            <UsernameModal modalActive={usernameModalActive} setModalActive={setUsernameModalActive}/>
            <ChooseFigureModal
                modalActive={figureModalActive}
                setModalActive={setFigureModalActive}
                selectedCell={selectedCell}
                cell={cell}
            />
            <EndGameModal modalActive={endModalActive} setModalActive={setEndModalActive} isWin={GameState._winner === GameState._color}/>
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
            <Chat msgArray={msgArray}/>
        </div>
    );
};

export default GamePage;