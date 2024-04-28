import {Colors} from "./Colors";
import {Figure, FigureNames} from "./figures/Figure";
import {Board} from "./Board";

export class Cell{
    readonly _x: number;
    readonly _y: number;
    readonly _color: Colors;
    _figure: Figure | null;
    _board: Board;
    _available: boolean;
    _id: number;

    constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
        this._board = board;
        this._x = x;
        this._y = y;
        this._color = color;
        this._figure = figure;
        this._available = false;
        this._id = Math.random()
    }

    isEmpty(): boolean {
        return this._figure === null;
    }

    isEnemy(target: Cell): boolean {
        if (target._figure){
            return this._figure?._color !== target._figure._color;
        }
        return false;
    }

    isEmptyVertical(target: Cell): boolean {
        if (this._x !== target._x)
            return false;

        const min = Math.min(this._y, target._y);
        const max = Math.max(this._y, target._y);

        for (let y = min + 1; y < max; y++){
            if (!this._board.getCell(this._x, y).isEmpty())
                return false;
        }
        return true;
    }

    isEmptyHorizontal(target: Cell): boolean {
        if (this._y !== target._y)
            return false;

        const min = Math.min(this._x, target._x);
        const max = Math.max(this._x, target._x);

        for (let x = min + 1; x < max; x++){
            if (!this._board.getCell(x, this._y).isEmpty())
                return false;
        }

        return true;
    }

    isEmptyDiagonal(target: Cell): boolean {
        const absX = Math.abs(this._x - target._x);
        const absY = Math.abs(this._y - target._y);
        if (absX !== absY)
            return false;

        const dy = this._y < target._y ? 1 : -1;
        const dx = this._x < target._x ? 1 : -1;

        for (let i = 1; i < absX; i++){
            if (!this._board.getCell(this._x + dx * i, this._y + dy * i).isEmpty())
                return false;
        }

        return true;
    }

    public isCellUnderAttack(target: Cell, color: Colors): boolean {
        for (const row of this._board._cells) {
            for (const cell of row) {
                const figure = cell._figure;
                if (figure && figure._color !== color) {
                    if (figure._name === FigureNames.PAWN && figure.canPawnAttack(true, target)) {
                        return true;
                    }

                    const tmp = target._figure;
                    target._figure = null;
                    if (figure.canAttack(target) && figure._name !== FigureNames.PAWN) {
                        target._figure = tmp;
                        return true;
                    }
                    target._figure = tmp;
                }
            }
        }
        return false;
    }


    setFigure(figure: Figure) {
        this._figure = figure;
        this._figure._cell = this;
    }

    addLostFigure(figure: Figure) {
        figure._color === Colors.BLACK ?
            this._board._lostBlackFigures.push(figure)
            :
            this._board._lostWhiteFigures.push(figure);
    }

    public moveFigure(targetCell: Cell) {
        if (this._figure){
            this._figure.moveFigure(targetCell);
            if (targetCell._figure){
                this.addLostFigure(targetCell._figure);
            }
            targetCell.setFigure(this._figure)
            this._figure = null;
        }
    }
}