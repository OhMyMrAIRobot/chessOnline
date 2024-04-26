import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackImg from "../../resources/images/kosal/black-pawn.svg";
import whiteImg from "../../resources/images/kosal/white-pawn.svg";

export class Pawn extends Figure {

    _isFirstStep: boolean = true;

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this._img = color === Colors.BLACK ? blackImg : whiteImg;
        this._name = FigureNames.PAWN;
    }

    private isPathObstructed(target: Cell): boolean {
        const direction = -1;
        const startY = this._cell._y + direction;
        const endY = target._y;
        const step = -1;

        for (let y = startY; y !== endY; y += step) {
            if (!this._cell._board.getCell(target._x, y).isEmpty()) {
                return true;
            }
        }

        return false;
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target))
            return false;

        const direction = -1;
        const firstStepDirection = -2;

        if (target._x === this._cell._x) {
            if (target._y === this._cell._y + direction && this._cell._board.getCell(target._x, target._y).isEmpty()) {
                if (!this._isFirstStep || !this.isPathObstructed(target)) {
                    return true;
                }
            } else if (this._isFirstStep && target._y === this._cell._y + firstStepDirection && this._cell._board.getCell(target._x, target._y).isEmpty()) {
                return !this.isPathObstructed(target);
            }
        }

        if (this.canPawnAttack(false, target) && this._cell.isEnemy(target)){
            return true;
        }

        return false;
    }

    moveFigure(target: Cell) {
        super.moveFigure(target);
        this._isFirstStep = false;
    }
}