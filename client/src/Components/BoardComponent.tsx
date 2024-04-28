import React, {FC, useEffect, useState} from 'react';
import {Board} from "../Models/Board";
import CellComponent from "./CellComponent";
import {Cell} from "../Models/Cell";
import {SendMessage} from "../Handlers/SendMessage";
import {useParams} from "react-router-dom";
import GameState from "../store/GameState";
import {Colors} from "../Models/Colors";
import {FigureNames} from "../Models/figures/Figure";

interface BoardProps {
    board: Board;
    curMove: Colors | null;
    updateBoard: () => void;
    setFigureModalActive: (active: boolean) => void;
    setSelectedCellOut: (cell: Cell | null) => void;
    setCell: (cell: Cell | null) => void;
}

const BoardComponent: FC<BoardProps> = ({board, updateBoard, curMove, setFigureModalActive, setCell, setSelectedCellOut}) => {

    const [selectedCell, setSelectedCell] = useState<Cell | null>(null)

    useEffect(() => {
        highlightCells();
    }, [selectedCell])

    const params = useParams()

    function click(cell: Cell) {
        if ((selectedCell && (selectedCell === cell)))
            setSelectedCell(null);
        else if (selectedCell && (selectedCell !== cell) && selectedCell._figure?.canMove(cell)){
            if (selectedCell._figure?._name === FigureNames.PAWN && cell._y === 0) {
                setSelectedCellOut(selectedCell);
                setCell(cell);
                setFigureModalActive(true);
            } else {
                SendMessage(GameState._socket, {
                    id: params.id,
                    method: 'move',
                    x0: selectedCell._x, y0: selectedCell._y,
                    x1: cell._x, y1: cell._y,
                });
            }
            setSelectedCell(null);
        } else {
            if (cell._figure?._color === GameState._color && curMove === GameState._color){
                setSelectedCell(cell);
            }
        }
    }

    function highlightCells() {
        board.highlightCells(selectedCell);
        updateBoard();
    }

    return (
        <div className="board">
            {board._cells.map((row, index) =>
                <React.Fragment key={index}>
                    {row.map(cell =>
                        <CellComponent
                            cell={cell}
                            key={cell._id}
                            selected={cell._x === selectedCell?._x && cell._y === selectedCell?._y}
                            click={click}
                        />
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default BoardComponent;