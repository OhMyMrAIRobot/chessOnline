import React, {FC} from 'react';
import {Cell} from "../Models/Cell";

interface CellProps{
    cell: Cell;
    selected: boolean;
    click: (cell: Cell) => void;
    digit: number | null;
    letter: string | null;
}

const CellComponent: FC<CellProps> = ({cell, selected, click, digit, letter}) => {
    return (
        <div
            className={["cell",
                cell._color, selected ? "selected" : "",
                cell._available && cell._figure ? "canAttack" : ""
            ].join(' ')}
            onClick={() => click(cell)}
        >
            {(digit !== null) && <span className={"cellDigit"}>{digit}</span>}
            {(letter !== null) && <span className={"cellLetter"}>{letter}</span>}

            {cell._figure?._img && <img className="figure" src={cell._figure._img} alt={cell._figure._name}/>}
            {!cell._figure && cell._available && <div className={'available'}></div>}
        </div>
    );
};

export default CellComponent;