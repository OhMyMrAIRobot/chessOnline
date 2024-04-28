import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackImg from "../../Resources/Images/kosal/black-king.svg";
import whiteImg from "../../Resources/Images/kosal/white-king.svg";

export class King extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this._img = color === Colors.BLACK ? blackImg : whiteImg;
        this._name = FigureNames.KING;
    }

    canMove(target: Cell): boolean {

        if (!super.canMove(target)) {
            return false;
        }

        if (Math.abs(target._x - this._cell._x) > 1 || Math.abs(target._y - this._cell._y) > 1) {
            return false;
        }

        if (this._cell.isCellUnderAttack(target, this._color)) {
            return false;
        }

        if (this._cell.isEmptyVertical(target)) {
            return true;
        }

        if (this._cell.isEmptyHorizontal(target)) {
            return true;
        }

        if (this._cell.isEmptyDiagonal(target)) {
            return true;
        }

        return false;
    }

    canAttack(target: Cell): boolean {
        return super.canAttack(target) && !(Math.abs(target._x - this._cell._x) > 1 || Math.abs(target._y - this._cell._y) > 1);
    }

    moveFigure(target: Cell): void {}
}