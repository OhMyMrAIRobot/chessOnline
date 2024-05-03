import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackImg from "../../Resources/Images/kosal/black-knight.svg";
import whiteImg from "../../Resources/Images/kosal/white-knight.svg";

export class Knight extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this._img = color === Colors.BLACK ? blackImg : whiteImg;
        this._name = FigureNames.KNIGHT;
    }

    public canMove(target: Cell): boolean {
        if(!super.canMove(target))
            return false;

        const dx = Math.abs(this._cell._x - target._x);
        const dy = Math.abs(this._cell._y - target._y);

        return (dx === 1 && dy === 2) || (dx  === 2 && dy === 1);
    }

    public canAttack(target: Cell): boolean {

        const dx = Math.abs(this._cell._x - target._x);
        const dy = Math.abs(this._cell._y - target._y);
        return super.canAttack(target) && ((dx === 1 && dy === 2) || (dx  === 2 && dy === 1));
    }
}