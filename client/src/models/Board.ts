import {Cell} from "./Cell";
import {Colors} from "./Colors";
import {Pawn} from "./figures/Pawn";
import {King} from "./figures/King";
import {Queen} from "./figures/Queen";
import {Bishop} from "./figures/Bishop";
import {Knight} from "./figures/Knight";
import {Rook} from "./figures/Rook";
import {Figure} from "./figures/Figure";
import {Player} from "./Player";

export class Board {
    _cells: Cell[][] = [];
    _lostWhiteFigures: Figure[] = [];
    _lostBlackFigures: Figure[] = [];
    _blackPlayer: boolean = false;

    // Fill board
    public initCells() {
        for (let i = 0; i < 8; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < 8; j++) {
                let color: Colors;
                if (this._blackPlayer) {
                    color = (i + j) % 2 === 0 ? Colors.BLACK : Colors.WHITE;
                } else {
                    color = (i + j) % 2 !== 0 ? Colors.BLACK : Colors.WHITE;
                }
                const cell = new Cell(this, j, i, color, null);
                row.push(cell);
            }
            this._cells.push(row);
        }
    }

    public getCell(x: number, y: number){
        return this._cells[y][x];
    }

    private addPawns() {
        for (let i = 0; i < 8; i++){
            new Pawn(Colors.BLACK, this.getCell(i, 1))
            new Pawn(Colors.WHITE, this.getCell(i, 6))
        }
    }

    private addKings() {
        new King(Colors.BLACK, this.getCell(4, 0))
        new King(Colors.WHITE, this.getCell(4, 7))
    }

    private addQueens() {
        new Queen(Colors.BLACK, this.getCell(3, 0))
        new Queen(Colors.WHITE, this.getCell(3, 7))
    }

    private addBishops() {
        new Bishop(Colors.BLACK, this.getCell(2,0));
        new Bishop(Colors.BLACK, this.getCell(5,0));
        new Bishop(Colors.WHITE, this.getCell(2,7));
        new Bishop(Colors.WHITE, this.getCell(5,7));
    }

    private addKnights() {
        new Knight(Colors.BLACK, this.getCell(1,0));
        new Knight(Colors.BLACK, this.getCell(6,0));
        new Knight(Colors.WHITE, this.getCell(1,7));
        new Knight(Colors.WHITE, this.getCell(6,7));
    }

    private addRooks() {
        new Rook(Colors.BLACK, this.getCell(0,0));
        new Rook(Colors.BLACK, this.getCell(7,0));
        new Rook(Colors.WHITE, this.getCell(0,7));
        new Rook(Colors.WHITE, this.getCell(7,7));
    }

    public addFigures() {
        this.addKings();
        this.addPawns();
        this.addQueens();
        this.addBishops();
        this.addKnights();
        this.addRooks();
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
        newBoard._blackPlayer = this._blackPlayer;
        return newBoard;
    }
}