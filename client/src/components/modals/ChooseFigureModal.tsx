import React, {FC} from 'react';
import Modal from "./Modal";
import GameState from "../../store/GameState";
import {Colors} from "../../models/Colors";
import whiteBishop from "../../resources/images/kosal/white-bishop.svg"
import blackBishop from "../../resources/images/kosal/black-bishop.svg"
import whiteQueen from "../../resources/images/kosal/white-queen.svg"
import blackQueen from "../../resources/images/kosal/black-queen.svg"
import whiteKnight from "../../resources/images/kosal/white-knight.svg"
import blackKnight from "../../resources/images/kosal/black-knight.svg"
import whitePawn from "../../resources/images/kosal/white-pawn.svg"
import blackPawn from "../../resources/images/kosal/black-pawn.svg"
import whiteRook from "../../resources/images/kosal/white-rook.svg"
import blackRook from "../../resources/images/kosal/black-rook.svg"
import {SendMessage} from "../../handlers/SendMessage";
import {useParams} from "react-router-dom";
import {Cell} from "../../models/Cell";

interface ChooseFigureModal {
    modalActive: boolean;
    selectedCell: Cell | null;
    cell: Cell | null;
    setModalActive: (active: boolean) => void;
}

const ChooseFigureModal: FC<ChooseFigureModal> = ({modalActive, setModalActive, selectedCell, cell}) => {

    const params = useParams();

    const figures: Array<{figure: string, src: string}> = GameState._color === Colors.WHITE ? [
        {figure: 'Bishop', src: whiteBishop},
        {figure: 'Knight', src: whiteKnight},
        {figure: 'Pawn', src: whitePawn},
        {figure: 'Queen', src: whiteQueen},
        {figure: 'Rook', src: whiteRook},
    ] : [
        {figure: 'Bishop', src: blackBishop},
        {figure: 'Knight', src: blackKnight},
        {figure: 'Pawn', src: blackPawn},
        {figure: 'Queen', src: blackQueen},
        {figure: 'Rook', src: blackRook},
    ]

    return (
        <Modal active={modalActive} setActive={setModalActive} canClose={false}>
            <div style={{textAlign: 'center'}}>
                <h4>Выберите фигуру</h4>
                <div style={{display: 'flex', gap: '10px', cursor: 'pointer'}}>
                    {figures.map(figure =>
                        <div
                            onClick={() => {
                                setModalActive(false);
                                if (selectedCell && cell)
                                    SendMessage(GameState._socket, {
                                        id: params.id,
                                        method: 'moveAndChange',
                                        figure: figure.figure,
                                        x0: selectedCell._x, y0: selectedCell._y,
                                        x1: cell._x, y1: cell._y,
                                    })
                            }}
                            key={Math.random()}>
                            <img width={"70px"} height={"70px"} alt="figure" src={figure.src}/>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
);
};

export default ChooseFigureModal;