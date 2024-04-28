import React, {useEffect, useState} from 'react';
import BoardComponent from "../Components/BoardComponent";
import LostFigures from "../Components/LostFigures";
import {Board} from "../Models/Board";
import {Colors} from "../Models/Colors";
import {useNavigate, useParams} from "react-router-dom";
import GameState from "../store/GameState";
import ChooseFigure from "../Components/modals/ChooseFigureModal";
import {Cell} from "../Models/Cell";
import {MessageHandler} from "../Handlers/MessageHandler";
import {ValidateGameHandler} from "../Handlers/ValidateGameHandler";
import UsernameModal from "../Components/modals/UsernameModal";
import {SendMessage} from "../Handlers/SendMessage";

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
        ValidateGameHandler(params.id).then(result => {
            if (!result || !(params.color === 'White' || params.color === 'Black'))
                navigate(`/`)
        }).catch(() => {
            navigate(`/`)
        })

        GameState.setSocket(socket)
        GameState.setColor(params.color === 'White' ? Colors.WHITE : Colors.BLACK);
        socket.onopen = () => {
            SendMessage(GameState._socket, {method: 'connection', id: params.id, username: '123', color: params.color});
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
            {/*<UsernameModal*/}
            {/*    modalActive={usernameModalActive}*/}
            {/*    setModalActive={setUsernameModalActive}*/}
            {/*/>*/}
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