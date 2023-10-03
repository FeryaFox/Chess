import './pieces'
import {colors, Rook, Knight, Bishop, Queen, King, Empty, Pawn} from "./pieces";

export class Board{
    pieces = []
    constructor() {
        // ... (ваш существующий код)

        this.selectedPiece = null; // Хранит выбранную фигуру
        this.dragStartX = 0;
        this.dragStartY = 0;

        // Добавьте обработчики событий для доски
        chessboard.addEventListener('dragstart', this.handleDragStart.bind(this));
        chessboard.addEventListener('dragover', this.handleDragOver.bind(this));
        chessboard.addEventListener('dragenter', this.handleDragEnter.bind(this));
        chessboard.addEventListener('dragleave', this.handleDragLeave.bind(this));
        chessboard.addEventListener('drop', this.handleDrop.bind(this));
        chessboard.addEventListener('dragend', this.handleDragEnd.bind(this));
    }

    initBoard(){
        this.pieces = [
            this.createFigures(colors.BLACK, 0),
            this.createPawns(colors.BLACK, 1),
            this.createEmpty(2),
            this.createEmpty(3),
            this.createEmpty(4),
            this.createEmpty(5),
            this.createPawns(colors.WHITE, 6),
            this.createFigures(colors.WHITE, 7)
        ]
    }
    getFigures(){
        return this.pieces
    }
    getFigure(position_x, position_y){
        return this.pieces[position_y][position_x]
    }

    createPawns(color, position_y){
        let pawns = []
        for (let i = 0; i < 8; i++){
            pawns[i] = new Pawn(color, i, position_y)
        }
        return pawns
    }

    createEmpty(position_y){
        let emptys = []
        for (let i = 0; i < 8; i++){
            emptys[i] = new Empty(i, position_y)
        }
        return emptys
    }
    createFigures(color, position_y){
        let figures = []
        figures[0] = new Rook(color, 0, position_y)
        figures[1] = new Knight(color, 1, position_y)
        figures[2] = new Bishop(color, 2, position_y)
        figures[3] = new Queen(color, 3, position_y)
        figures[4] = new King(color, 4, position_y)
        figures[5] = new Bishop(color, 5, position_y)
        figures[6] = new Knight(color, 6, position_y)
        figures[7] = new Rook(color, 7, position_y)
        return figures
    }

    setDocumentElementToFigure(position_x, position_y, documentElement){
        this.pieces[position_y][position_x].documentElement = documentElement
    }
}