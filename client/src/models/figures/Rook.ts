import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackImg from "../../resources/images/kosal/black-rook.svg";
import whiteImg from "../../resources/images/kosal/white-rook.svg";

export class Rook extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this._img = color === Colors.BLACK ? blackImg : whiteImg;
        this._name = FigureNames.ROOK;
    }

    canMove(target: Cell): boolean {
        if(!super.canMove(target))
            return false;
        if (this._cell.isEmptyVertical(target))
            return true;
        if (this._cell.isEmptyHorizontal(target))
            return true;
        return false;
    }

    canAttack(target: Cell): boolean {
        return super.canAttack(target) && (this._cell.isEmptyVertical(target) || this._cell.isEmptyHorizontal(target));
    }
}