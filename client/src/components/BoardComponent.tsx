import React, {FC, useEffect, useState} from 'react';
import {Board} from "../models/Board";
import CellComponent from "./CellComponent";
import {Cell} from "../models/Cell";
import {Player} from "../models/Player";
import {sendMessage} from "../handlers/sendMessage";
import {useParams} from "react-router-dom";
import GameState from "../store/GameState";

interface BoardProps {
    board: Board;
    currentPlayer: Player | null;
    swapPlayer: (player: Player) => void;
    updateBoard: () => void;
}

const BoardComponent: FC<BoardProps> = ({board, updateBoard, currentPlayer, swapPlayer}) => {

    const [selectedCell, setSelectedCell] = useState<Cell | null>(null)

    useEffect(() => {
        highlightCells();
    }, [selectedCell])

    const params = useParams()

    function click(cell: Cell) {
        if ((selectedCell && (selectedCell === cell)))
            setSelectedCell(null);
        else if (selectedCell && (selectedCell !== cell) && selectedCell._figure?.canMove(cell) && currentPlayer){
            sendMessage(GameState._socket, {
                id: params.id,
                method: 'move',
                x0: selectedCell._x, y0: selectedCell._y, // from
                x1: cell._x, y1: cell._y, // to
            });
     //       swapPlayer(currentPlayer);
            setSelectedCell(null);
        } else {
            if (cell._figure?._color === currentPlayer?._color){
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