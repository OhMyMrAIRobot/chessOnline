import React, {FC, useEffect, useState} from 'react';
import {Board} from "../Models/Board";
import CellComponent from "./CellComponent";
import {Cell} from "../Models/Cell";
import {SendMessage} from "../Handlers/SendMessage";
import GameState from "../Store/GameState";
import {Colors} from "../Models/Colors";
import {FigureNames} from "../Models/figures/Figure";
import {King} from "../Models/figures/King";

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

    function click(cell: Cell) {
        if ((selectedCell && (selectedCell === cell)))
            setSelectedCell(null);
        else if (selectedCell && (selectedCell !== cell) && selectedCell._figure?.canMove(cell)){
            if (selectedCell._figure?._name === FigureNames.PAWN && cell._y === 0) {
                setSelectedCellOut(selectedCell);
                setCell(cell);
                setFigureModalActive(true);
            } else if (selectedCell._figure?._name === FigureNames.KING && (cell._y === 7 && cell._x === (GameState._color === Colors.WHITE ? 2 : 1) && (selectedCell._figure as King).canLeftCastle(cell)))
            {
                SendMessage(GameState._socket, {
                    id: GameState._session,
                    color: GameState._color,
                    method: 'leftCastle',
                })
            } else if (selectedCell._figure?._name === FigureNames.KING && (cell._y === 7 && cell._x === (GameState._color === Colors.WHITE ? 6 : 5) && (selectedCell._figure as King).canRightCastle(cell)))
            {
                SendMessage(GameState._socket, {
                    id: GameState._session,
                    color: GameState._color,
                    method: 'rightCastle',
                })
            } else {
                SendMessage(GameState._socket, {
                    id: GameState._session,
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
            {board._cells.map((row, rowIndex) =>
                <React.Fragment key={rowIndex}>
                    {row.map((cell, colIndex) =>
                        <CellComponent
                            cell={cell}
                            key={cell._id}
                            selected={cell._x === selectedCell?._x && cell._y === selectedCell?._y}
                            click={click}
                            digit={colIndex === 0 ? GameState._color === Colors.BLACK ? rowIndex + 1 : 7 - rowIndex + 1 : null}
                            letter={rowIndex === 7 ? GameState._color === Colors.WHITE ? String.fromCharCode(colIndex + 65) : String.fromCharCode(65 + 7 - colIndex) : null}
                        />
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default BoardComponent;