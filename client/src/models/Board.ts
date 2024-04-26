import {Cell} from "./Cell";
import {Colors} from "./Colors";
import {Pawn} from "./figures/Pawn";
import {King} from "./figures/King";
import {Queen} from "./figures/Queen";
import {Bishop} from "./figures/Bishop";
import {Knight} from "./figures/Knight";
import {Rook} from "./figures/Rook";
import {Figure} from "./figures/Figure";
import GameState from "../store/GameState";
import gameState from "../store/GameState";

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
                const color: Colors = (i + j) % 2 !== 0 ? Colors.BLACK : Colors.WHITE;
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
        for (let i = 0; i < 8; i++) {
            const whitePawn = GameState._color === Colors.WHITE ? 1 : 6;
            const blackPawn = 7 - whitePawn;

            new Pawn(Colors.BLACK, this.getCell(i, blackPawn));
            new Pawn(Colors.WHITE, this.getCell(i, whitePawn));
        }
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

    public addFigures() {
    //    this.addKings();
        this.addPawns();
        // this.addQueens();
        // this.addBishops();
        // this.addKnights();
        // this.addRooks();
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