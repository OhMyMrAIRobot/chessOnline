import React, {FC, useEffect, useState} from 'react';
import {Board} from "../models/Board";
import CellComponent from "./CellComponent";
import {Cell} from "../models/Cell";
import {sendMessage} from "../handlers/sendMessage";
import {useParams} from "react-router-dom";
import GameState from "../store/GameState";
import {Colors} from "../models/Colors";

interface BoardProps {
    board: Board;
    curMove: Colors | null;
    updateBoard: () => void;
}

const BoardComponent: FC<BoardProps> = ({board, updateBoard, curMove}) => {

    const [selectedCell, setSelectedCell] = useState<Cell | null>(null)

    useEffect(() => {
        highlightCells();
    }, [selectedCell])

    const params = useParams()

    function click(cell: Cell) {
        if ((selectedCell && (selectedCell === cell)))
            setSelectedCell(null);
        else if (selectedCell && (selectedCell !== cell) && selectedCell._figure?.canMove(cell)){
            sendMessage(GameState._socket, {
                id: params.id,
                method: 'move',
                x0: selectedCell._x, y0: selectedCell._y, // from
                x1: cell._x, y1: cell._y, // to
            });
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
        <div>
            <div className="board">
                {board._cells.map((row,index) =>
                    <React.Fragment key={index}>
                        {row.map(cell =>
                            <CellComponent
                                cell = {cell}
                                key = {cell._id}
                                selected={cell._x === selectedCell?._x && cell._y === selectedCell?._y}
                                click = {click}
                            />
                        )}
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default BoardComponent;