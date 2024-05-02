import {Cell} from "./Cell";
import {Colors} from "./Colors";
import {Pawn} from "./figures/Pawn";
import {King} from "./figures/King";
import {Queen} from "./figures/Queen";
import {Bishop} from "./figures/Bishop";
import {Knight} from "./figures/Knight";
import {Rook} from "./figures/Rook";
import {Figure, FigureNames} from "./figures/Figure";
import GameState from "../Store/GameState";
import gameState from "../Store/GameState";

export class Board {
    _cells: Cell[][] = [];
    _lostWhiteFigures: Figure[] = [];
    _lostBlackFigures: Figure[] = [];

    // Fill board
    public initCells() {
        for (let i = 0; i < 8; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < 8; j++) {
                const color: Colors = (i + j) % 2 !== 0 ? Colors.BLACK : Colors.WHITE;
                const cell = new Cell(this, j, i, color, null);
                row.push(cell);
            }
            this._cells.push(row);
        }
    }

    public addFigures() {

        // default game
        // this.addKings();
        //this.addQueens();
        //this.addRooks();
        //this.addKnights();
        //this.addPawns();
        // this.addBishops();

        // for mate with only pawns & kings
        // this.addPawns();
        // new Pawn(Colors.WHITE, this.getCell(GameState._color === Colors.WHITE ? 7 : 0, GameState._color === Colors.WHITE ? 1 : 6))
        // new Pawn(Colors.BLACK, this.getCell(GameState._color === Colors.WHITE ? 0 : 7, GameState._color === Colors.WHITE ? 6 : 1))

        // for stalemate
        new King(Colors.BLACK, this.getCell(GameState._color === Colors.WHITE ? 0 : 7, GameState._color === Colors.WHITE ? 0 : 7));
        new King(Colors.WHITE, this.getCell(GameState._color === Colors.WHITE ? 7 : 0,GameState._color === Colors.WHITE ? 7 : 0));
        new Queen(Colors.WHITE, this.getCell(GameState._color === Colors.WHITE ? 2 : 5, GameState._color === Colors.WHITE ? 2 : 5));
        new Pawn(Colors.BLACK, this.getCell(GameState._color === Colors.WHITE ? 7 : 0, GameState._color === Colors.WHITE ? 0 : 7));
        new Pawn(Colors.WHITE, this.getCell(GameState._color === Colors.WHITE ? 7 : 0, GameState._color === Colors.WHITE ? 1 : 6));
    }

    public getCell(x: number, y: number){
        return this._cells[y][x];
    }

    checkMate(color: Colors): boolean {
        const king = this.getKing(color);
        if (!king.isCellUnderAttack(king, color)) {
            return false;
        }

        return !this.checkMoves(color);
    }

    checkMoves(color: Colors): boolean {
        for (const row of this._cells) {
            for (const cell of row) {
                const figure = cell._figure;
                if (figure && figure._color === color) {
                    for (let i = 0; i < 8; i++) {
                        for (let j = 0; j < 8; j++) {
                            const targetCell = this.getCell(i, j);
                            if (figure.canMove(targetCell)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false
    }

    checkStalemate():boolean {
        if (this.checkKings())
            return true;
        const whiteKing = this.getKing(Colors.WHITE);
        const blackKing = this.getKing(Colors.BLACK);

        return (!this.checkMoves(Colors.WHITE) && !whiteKing.isCellUnderAttack(whiteKing, Colors.BLACK))
            || (!this.checkMoves(Colors.BLACK) && !blackKing.isCellUnderAttack(blackKing, Colors.WHITE));
    }

    checkKings() {
        for (const row of this._cells) {
            for (const cell of row) {
                if (cell._figure && cell._figure?._name !== FigureNames.KING)
                    return false
            }
        }

        return true
    }

    getKing(color: Colors): Cell {
        let result: Cell = new Cell(this, 0, 0, Colors.WHITE, null);
        for (let i = 0; i < this._cells.length; i++){
            const row = this._cells[i];
            row.forEach((cell: Cell) => {
                if (cell._figure?._name === FigureNames.KING && cell._figure?._color === color){
                    result = cell;
                }
            })
        }

        return result;
    }

    private addKings() {
        if (gameState._color === Colors.WHITE){
            new King(Colors.BLACK, this.getCell(4, 0));
            new King(Colors.WHITE, this.getCell(4, 7));
        } else {
            new King(Colors.BLACK, this.getCell(3, 7));
            new King(Colors.WHITE, this.getCell(3, 0));
        }
    }

    private addQueens() {
        if (gameState._color === Colors.WHITE){
            new Queen(Colors.BLACK, this.getCell(3, 0));
            new Queen(Colors.WHITE, this.getCell(3, 7));
        } else {
            new Queen(Colors.BLACK, this.getCell(4, 7));
            new Queen(Colors.WHITE, this.getCell(4, 0));
        }
    }

    private addBishops() {
        const color1 = (GameState._color === Colors.WHITE) ? Colors.BLACK : Colors.WHITE;
        const color2 = color1 === Colors.WHITE ? Colors.BLACK : Colors.WHITE;

        new Bishop(color1, this.getCell(2, 0));
        new Bishop(color1, this.getCell(5, 0));
        new Bishop(color2, this.getCell(2, 7));
        new Bishop(color2, this.getCell(5, 7));
    }

    private addKnights() {
        const color1 = (GameState._color === Colors.WHITE) ? Colors.BLACK : Colors.WHITE;
        const color2 = color1 === Colors.WHITE ? Colors.BLACK : Colors.WHITE;

        new Knight(color1, this.getCell(1,0));
        new Knight(color1, this.getCell(6,0));
        new Knight(color2, this.getCell(1,7));
        new Knight(color2, this.getCell(6,7));
    }

    private addRooks() {
        const color1 = (GameState._color === Colors.WHITE) ? Colors.BLACK : Colors.WHITE;
        const color2 = color1 === Colors.WHITE ? Colors.BLACK : Colors.WHITE;

        new Rook(color1, this.getCell(0,0));
        new Rook(color1, this.getCell(7,0));
        new Rook(color2, this.getCell(0,7));
        new Rook(color2, this.getCell(7,7));
    }

    private addPawns() {
        for (let i = 0; i < 8; i++) {
            const whitePawn: number = GameState._color === Colors.WHITE ? 6 : 1;
            const blackPawn: number = 7 - whitePawn;

            new Pawn(Colors.BLACK, this.getCell(i, blackPawn));
            new Pawn(Colors.WHITE, this.getCell(i, whitePawn));
        }
    }


    public highlightCells(selectedCell: Cell | null)  {
        for (let i = 0; i < this._cells.length; i++){
            const row = this._cells[i];
            for (let j = 0; j < row.length; j++){
                const target = row[j];
                target._available = !!selectedCell?._figure?.canMove(target);
            }
        }
    }

    public getCopyBoard() : Board {
        const newBoard = new Board();
        newBoard._cells = this._cells;
        newBoard._lostWhiteFigures = this._lostWhiteFigures;
        newBoard._lostBlackFigures = this._lostBlackFigures;
        return newBoard;
    }

    public moveRookAndKing = (oldRookCell: Cell, oldKingCell: Cell, newRookCell: Cell, newKingCell: Cell, rookColor: Colors) => {
        oldRookCell._figure = null;
        oldKingCell._figure = null;
        newRookCell._figure = new Rook(rookColor, newRookCell);
        newKingCell._figure = new King(rookColor, newKingCell);
    };

    public leftCastle = (color: Colors) => {
        const rookColor = color === Colors.WHITE ? Colors.WHITE : Colors.BLACK;
        if (GameState._color === Colors.WHITE) {
            if (color === Colors.WHITE) {
                this.moveRookAndKing(this.getCell(0, 7), this.getCell(4, 7), this.getCell(3, 7), this.getCell(2, 7), rookColor);
            } else {
                this.moveRookAndKing(this.getCell(7, 0), this.getCell(4, 0), this.getCell(5, 0), this.getCell(6, 0), rookColor);
            }
        } else {
            if (color === Colors.WHITE) {
                this.moveRookAndKing(this.getCell(7, 0), this.getCell(3, 0), this.getCell(4, 0), this.getCell(5, 0), rookColor);
            } else {
                this.moveRookAndKing(this.getCell(0, 7), this.getCell(3, 7), this.getCell(2, 7), this.getCell(1, 7), rookColor);
            }
        }
    };

    public rightCastle = (color: Colors) => {
        const rookColor = color === Colors.WHITE ? Colors.WHITE : Colors.BLACK;
        if (GameState._color === Colors.WHITE) {
            if (color === Colors.WHITE) {
                this.moveRookAndKing(this.getCell(7, 7), this.getCell(4, 7), this.getCell(5, 7), this.getCell(6, 7), rookColor);
            } else {
                this.moveRookAndKing(this.getCell(0, 0), this.getCell(4, 0), this.getCell(3, 0), this.getCell(2, 0), rookColor);
            }
        } else {
            if (color === Colors.WHITE) {
                this.moveRookAndKing(this.getCell(0, 0), this.getCell(3, 0), this.getCell(2, 0), this.getCell(1, 0), rookColor);
            } else {
                this.moveRookAndKing(this.getCell(7, 7), this.getCell(3, 7), this.getCell(4, 7), this.getCell(5, 7), rookColor);
            }
        }
    }

    public moveAndChange = (curMove: Colors, x0: number, y0: number, x1:number, y1:number, change: boolean, figure?: string) => {
        let selectedCell: Cell;
        let cell: Cell;
        if (curMove === GameState._color){
            selectedCell = this.getCell(x0, y0);
            cell = this.getCell(x1, y1);
        } else {
            selectedCell = this.getCell(7 - x0, 7 - y0);
            cell = this.getCell(7 - x1, 7 - y1);
        }
        selectedCell.moveFigure(cell);
        if (change && cell._figure) {
            switch (figure){
                case 'Bishop':
                    cell._figure = new Bishop(cell._figure._color, cell);
                    break;
                case 'Knight':
                    cell._figure = new Knight(cell._figure._color, cell);
                    break;
                case 'Queen':
                    cell._figure = new Queen(cell._figure._color, cell);
                    break;
                case 'Rook':
                    cell._figure = new Rook(cell._figure._color, cell);
                    break;
            }
        }
    }
}