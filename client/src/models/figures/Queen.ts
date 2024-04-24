import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackImg from "../../resourses/images/kosal/black-queen.svg";
import whiteImg from "../../resourses/images/kosal/white-queen.svg";

export class Queen extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this._img = color === Colors.BLACK ? blackImg : whiteImg;
        this._name = FigureNames.QUEEN;
    }

    canMove(target: Cell): boolean {
        if(!super.canMove(target))
            return false;
        if (this._cell.isEmptyVertical(target))
            return true;
        if (this._cell.isEmptyHorizontal(target))
            return true;
        if (this._cell.isEmptyDiagonal(target))
            return true;
        return false;
    }
}