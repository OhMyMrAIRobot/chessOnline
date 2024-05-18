import React, {useEffect, useState} from 'react';
import BoardComponent from "../Components/BoardComponent";
import LostFigures from "../Components/LostFigures";
import {Board} from "../Models/Board";
import {Colors} from "../Models/Colors";
import {useNavigate, useParams} from "react-router-dom";
import GameState from "../Store/GameState";
import ChooseFigureModal from "../Components/Modals/ChooseFigureModal";
import {Cell} from "../Models/Cell";
import {MessageHandler} from "../Handlers/MessageHandler";
import {ValidateGameHandler} from "../Handlers/ValidateGameHandler";
import UsernameModal from "../Components/Modals/UsernameModal";
import EndGameModal from "../Components/Modals/EndGameModal";
import Chat from "../Components/ChatComponent";
import SideBar from "../Components/SideBar";
import {autorun} from "mobx";
import OfferDrawModal from "../Components/Modals/OfferDrawModal";
import useSound from "use-sound";
import moveSound from "../Resources/Sounds/Move.wav";
import {SendMessage} from "../Handlers/SendMessage";

const GamePage = () => {
    // Modals
    const [usernameModalActive, setUsernameModalActive] = useState<boolean>(true);
    const [figureModalActive, setFigureModalActive] = useState<boolean>(false);
    const [endModalActive, setEndModalActive] = useState<boolean>(false);
    const [drawModalActive, setDrawModalActive] = useState<boolean>(false);

    const [board, setBoard] = useState(new Board());
    const [socket, setSocket] = useState(new WebSocket(`ws://localhost:8080`));
    const [curMove, setCurMove] = useState<Colors | null>(null);
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const [cell, setCell] = useState<Cell | null>(null);
    const [msgArray, setMsgArray] = useState<any[]>([])
    const [play] = useSound(moveSound);

    // window.onunload = () => {
    //     if (GameState._username){
    //         SendMessage(GameState._socket,{
    //             method: 'disconnect', id:
    //             GameState._session,
    //             username: GameState._username,
    //             color: GameState._color
    //         })
    //     }
    //     GameState._socket.close();
    // }

    useEffect(() => {
        MessageHandler(socket, board, curMove, setCurMove, updateBoard, setMsgArray, setDrawModalActive);
        if (curMove && board.checkMate(curMove)){
            GameState.setWinner(curMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
            setMsgArray(prev => [...prev, {type: 'win', color: GameState._color}])
        }
        else if (curMove && board.checkStalemate()) {
            GameState.setDraw();
            GameState.setTimerActive(false);
            setMsgArray(prev => [...prev, {type: 'agreeDraw'}])
        }
        if (curMove){
            play()
        }

    }, [curMove]);

    useEffect(() => {
        autorun(() => {
            if (GameState._winner || GameState._isDraw) {
                setEndModalActive(true);
                setCurMove(null);
            }
        });
    }, []);

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
        };
    }, [])

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    return (
        <div className="app">
            <UsernameModal modalActive={usernameModalActive} setModalActive={setUsernameModalActive}/>

            <ChooseFigureModal
                modalActive={figureModalActive}
                setModalActive={setFigureModalActive}
                selectedCell={selectedCell}
                cell={cell}
            />

            <EndGameModal
                modalActive={endModalActive}
                setModalActive={setEndModalActive}
            />

            <OfferDrawModal modalActive={drawModalActive} setModalActive={setDrawModalActive} />

            <SideBar curMove={curMove}/>

            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                <LostFigures
                    figures={GameState._color === Colors.WHITE ? board._lostBlackFigures : board._lostWhiteFigures}
                />
                <div style={{border:'2px solid black'}}>
                    <BoardComponent
                        board={board}
                        updateBoard={updateBoard}
                        curMove={curMove}
                        setFigureModalActive={setFigureModalActive}
                        setSelectedCellOut={setSelectedCell}
                        setCell={setCell}
                    />
                </div>

                <LostFigures
                    figures={GameState._color === Colors.WHITE ? board._lostWhiteFigures : board._lostBlackFigures}
                />
            </div>

            <Chat msgArray={msgArray}/>
        </div>
    );
};

export default GamePage;