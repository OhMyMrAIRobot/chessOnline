import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackImg from "../../Resources/Images/kosal/black-bishop.svg"
import whiteImg from "../../Resources/Images/kosal/white-bishop.svg"

export class Bishop extends Figure {

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this._img = color === Colors.BLACK ? blackImg : whiteImg;
        this._name = FigureNames.BISHOP;
    }

    canMove(target: Cell): boolean {
        if(!super.canMove(target))
            return false;
        if (this._cell.isEmptyDiagonal(target))
            return true;
        return false;
    }

    canAttack(target: Cell): boolean {
        return super.canAttack(target) && this._cell.isEmptyDiagonal(target);
    }
}