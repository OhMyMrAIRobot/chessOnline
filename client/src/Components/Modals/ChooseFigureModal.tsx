import React, {FC} from 'react';
import Modal from "./Modal";
import GameState from "../../Store/GameState";
import {Colors} from "../../Models/Colors";
import whiteBishop from "../../Resources/Images/kosal/white-bishop.svg"
import blackBishop from "../../Resources/Images/kosal/black-bishop.svg"
import whiteQueen from "../../Resources/Images/kosal/white-queen.svg"
import blackQueen from "../../Resources/Images/kosal/black-queen.svg"
import whiteKnight from "../../Resources/Images/kosal/white-knight.svg"
import blackKnight from "../../Resources/Images/kosal/black-knight.svg"
import whiteRook from "../../Resources/Images/kosal/white-rook.svg"
import blackRook from "../../Resources/Images/kosal/black-rook.svg"
import {SendMessage} from "../../Handlers/SendMessage";
import {Cell} from "../../Models/Cell";

interface ChooseFigureModalProps {
    modalActive: boolean;
    selectedCell: Cell | null;
    cell: Cell | null;
    setModalActive: (active: boolean) => void;
}

const ChooseFigureModal: FC<ChooseFigureModalProps> = ({modalActive, setModalActive, selectedCell, cell}) => {

    const figures: Array<{figure: string, src: string}> = GameState._color === Colors.WHITE ? [
        {figure: 'Bishop', src: whiteBishop},
        {figure: 'Knight', src: whiteKnight},
        {figure: 'Queen', src: whiteQueen},
        {figure: 'Rook', src: whiteRook},
    ] : [
        {figure: 'Bishop', src: blackBishop},
        {figure: 'Knight', src: blackKnight},
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
                                        id: GameState._session,
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