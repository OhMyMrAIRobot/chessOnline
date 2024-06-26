import {Colors} from "../Colors";
import {Cell} from "../Cell";
import img from "../../Resources/Images/black-knight.png"
import GameState from "../../Store/GameState";

export enum FigureNames{
    FIGURE = "Figure",
    KING = "King",
    QUEEN= "Queen",
    KNIGHT = "Knight",
    PAWN = "Pawn",
    ROOK = "Rook",
    BISHOP = "Bishop",
}

export class Figure{
    _color: Colors;
    _img: typeof img | null;
    _cell: Cell;
    _name: FigureNames;
    _id: number;

    constructor(color: Colors, cell: Cell) {
        this._color = color;
        this._cell = cell;
        this._cell._figure = this;
        this._img = null;
        this._name = FigureNames.FIGURE;
        this._id = Math.random();
    }

    public canAttack(target: Cell): boolean {
        if (target._figure?._color === this._color)
            return false;
        return true;
    }

    public canMove(target: Cell) : boolean {
        if (target._figure?._color === this._color) // same color
            return false;

        const king = target._board.getKing(this._color);
        const tmpFigure = target._figure;
        target._figure = this;
        this._cell._figure = null;
        const newKing = target._board.getKing(this._color);
        if (!king.isCellUnderAttack(newKing, this._color)) {
            target._figure = tmpFigure;
            this._cell._figure = this;
            return true;
        }

        target._figure = tmpFigure;
        this._cell._figure = this;
        return false;
    }

    public canPawnAttack(target: Cell): boolean {
        let direction;
        if (GameState._color === Colors.WHITE) {
            if (this._color === Colors.WHITE) {
                direction = -1;
            } else {
                direction = 1;
            }
        } else {
            if (this._color === Colors.WHITE) {
                direction = 1;
            } else {
                direction = -1;
            }
        }
        return target._y === this._cell._y + direction && (target._x === this._cell._x + 1 || target._x === this._cell._x - 1);
    }

    public moveFigure(target: Cell){}
}